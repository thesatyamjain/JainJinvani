import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/update_dialog.dart';

/// Industry-standard model representing an OTA update release payload.
class UpdateInfo {
  final String tagName;
  final String cleanVersion;
  final int? versionCode;
  final String title;
  final String notes;
  final String downloadUrl;
  final String? universalUrl;
  final String? appStoreUrl;
  final String? sha256;
  final double sizeMb;
  final bool isMandatory;
  final String? minSupportedVersion;

  UpdateInfo({
    required this.tagName,
    required this.cleanVersion,
    this.versionCode,
    required this.title,
    required this.notes,
    required this.downloadUrl,
    this.universalUrl,
    this.appStoreUrl,
    this.sha256,
    required this.sizeMb,
    this.isMandatory = false,
    this.minSupportedVersion,
  });
}

/// Industry-standard OTA Update Service with dual-source fallback:
/// 1. Cloudflare Pages fast JSON manifest with cache-busting (zero rate-limits)
/// 2. GitHub Releases REST API fallback
///
/// Features:
/// - Semantic versioning (SemVer 2.0.0) + build number comparison
/// - Mandatory/force update enforcement based on minSupportedVersion
/// - Platform-aware routing (in-app APK installation on Android, App Store on iOS)
/// - Background check throttling to conserve battery and bandwidth
class UpdateService {
  static const String repoOwner = 'thesatyamjain';
  static const String repoName = 'jainjinvani';
  static const String keyLastOtaCheck = 'ota_last_check_ms';
  static const int throttleIntervalMs = 12 * 60 * 60 * 1000; // 12 hours

  static bool _isChecking = false;

  /// Helper to extract numeric version parts for SemVer comparison (e.g. "1.0.3" -> [1, 0, 3])
  static List<int> parseVersionParts(String version) {
    final core = version.trim().replaceFirst(RegExp(r'^[vV]'), '').split('+').first;
    return core
        .split('.')
        .map((part) => int.tryParse(RegExp(r'\d+').firstMatch(part)?.group(0) ?? '') ?? 0)
        .toList();
  }

  /// Helper to extract build code from strings like "1.0.3+5"
  static int? parseBuildNumber(String version) {
    if (version.contains('+')) {
      final buildStr = version.split('+').last;
      return int.tryParse(buildStr);
    }
    return null;
  }

  /// Comprehensive SemVer comparator that compares major, minor, patch and build numbers
  static bool isNewerVersion(
    String remote,
    String current, {
    int? remoteBuild,
    int? currentBuild,
  }) {
    try {
      final rParts = parseVersionParts(remote);
      final cParts = parseVersionParts(current);

      final maxLen = rParts.length > cParts.length ? rParts.length : cParts.length;
      while (rParts.length < maxLen) {
        rParts.add(0);
      }
      while (cParts.length < maxLen) {
        cParts.add(0);
      }

      for (int i = 0; i < maxLen; i++) {
        if (rParts[i] > cParts[i]) return true;
        if (rParts[i] < cParts[i]) return false;
      }

      // If version numbers are identical, check build numbers if provided
      final rB = remoteBuild ?? parseBuildNumber(remote);
      final cB = currentBuild ?? parseBuildNumber(current);
      if (rB != null && cB != null) {
        return rB > cB;
      }

      return false;
    } catch (_) {
      return false;
    }
  }

  /// Evaluates whether the current version falls below a minimum required threshold
  static bool isBelowMinVersion(String current, String minSupported) {
    try {
      final cParts = parseVersionParts(current);
      final mParts = parseVersionParts(minSupported);

      final maxLen = cParts.length > mParts.length ? cParts.length : mParts.length;
      while (cParts.length < maxLen) {
        cParts.add(0);
      }
      while (mParts.length < maxLen) {
        mParts.add(0);
      }

      for (int i = 0; i < maxLen; i++) {
        if (cParts[i] < mParts[i]) return true;
        if (cParts[i] > mParts[i]) return false;
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  /// Check for updates with dual source
  static Future<UpdateInfo?> getLatestUpdate({bool ignoreThrottle = false}) async {
    try {
      final packageInfo = await PackageInfo.fromPlatform();
      final currentVersion = packageInfo.version;
      final currentBuild = int.tryParse(packageInfo.buildNumber) ?? 0;
      debugPrint('Current App Version: $currentVersion (Build $currentBuild)');

      // 1. Primary check: Cloudflare Pages fast JSON manifest with anti-cache
      final cfUpdate = await _checkFromCloudflarePages(currentVersion, currentBuild);
      if (cfUpdate != null) {
        debugPrint('OTA Update available via Cloudflare Pages: ${cfUpdate.cleanVersion}');
        return cfUpdate;
      }

      // 2. Fallback check: GitHub Releases REST API
      final ghUpdate = await _checkFromGitHub(currentVersion, currentBuild);
      if (ghUpdate != null) {
        debugPrint('OTA Update available via GitHub Releases: ${ghUpdate.cleanVersion}');
        return ghUpdate;
      }
    } catch (e) {
      debugPrint('Update check note: $e');
    }
    return null;
  }

  static Future<UpdateInfo?> _checkFromCloudflarePages(
    String currentVersion,
    int currentBuild,
  ) async {
    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 6);
      final uri = Uri.parse(
        'https://jainjinvani.pages.dev/version.json?t=${DateTime.now().millisecondsSinceEpoch}',
      );
      final request = await client.getUrl(uri);
      request.headers.set('User-Agent', 'JainJinvani-App');
      request.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      request.headers.set('Pragma', 'no-cache');

      final response = await request.close();
      if (response.statusCode == 200) {
        final body = await response.transform(utf8.decoder).join();
        final data = jsonDecode(body) as Map<String, dynamic>;
        final version = data['version'] as String? ?? '';
        final cleanRemote = version.trim().replaceFirst(RegExp(r'^[vV]'), '').split('+').first;
        final remoteBuild = data['versionCode'] as int? ??
            (data['buildNumber'] as int?) ??
            parseBuildNumber(version);

        final minSupported = data['minSupportedVersion'] as String?;
        final isExplicitMandatory = data['mandatory'] as bool? ?? false;
        final isBelowMin = minSupported != null && isBelowMinVersion(currentVersion, minSupported);
        final bool mandatory = isExplicitMandatory || isBelowMin;

        if (cleanRemote.isNotEmpty &&
            isNewerVersion(cleanRemote, currentVersion,
                remoteBuild: remoteBuild, currentBuild: currentBuild)) {
          final downloadUrl = data['downloadUrl'] as String? ?? '';
          if (downloadUrl.isNotEmpty) {
            return UpdateInfo(
              tagName: data['tagName'] as String? ?? 'v$cleanRemote',
              cleanVersion: cleanRemote,
              versionCode: remoteBuild,
              title: data['title'] as String? ??
                  (mandatory ? 'अत्यावश्यक अपडेट v$cleanRemote' : 'नया संस्करण v$cleanRemote'),
              notes: data['notes'] as String? ?? '',
              downloadUrl: downloadUrl,
              universalUrl: data['universalUrl'] as String?,
              appStoreUrl: data['appStoreUrl'] as String?,
              sha256: data['sha256'] as String?,
              sizeMb: (data['sizeMb'] as num? ?? 35.0).toDouble(),
              isMandatory: mandatory,
              minSupportedVersion: minSupported,
            );
          }
        }
      }
    } catch (e) {
      debugPrint('Cloudflare version check note: $e');
    }
    return null;
  }

  static Future<UpdateInfo?> _checkFromGitHub(
    String currentVersion,
    int currentBuild,
  ) async {
    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 8);
      final uri = Uri.parse(
        'https://api.github.com/repos/$repoOwner/$repoName/releases/latest',
      );
      final request = await client.getUrl(uri);
      request.headers.set('User-Agent', 'JainJinvani-App');
      request.headers.set('Accept', 'application/vnd.github.v3+json');

      final response = await request.close();
      if (response.statusCode == 200) {
        final responseBody = await response.transform(utf8.decoder).join();
        final data = jsonDecode(responseBody) as Map<String, dynamic>;

        final tagName = data['tag_name'] as String? ?? '';
        final cleanRemote = tagName.trim().replaceFirst(RegExp(r'^[vV]'), '').split('+').first;
        final remoteBuild = parseBuildNumber(tagName);

        final bodyNotes = data['body'] as String? ?? '';
        final bool isMandatory = bodyNotes.toLowerCase().contains('[mandatory]') ||
            bodyNotes.toLowerCase().contains('[critical]');

        if (cleanRemote.isNotEmpty &&
            isNewerVersion(cleanRemote, currentVersion,
                remoteBuild: remoteBuild, currentBuild: currentBuild)) {
          final assets = data['assets'] as List<dynamic>? ?? [];
          String? downloadUrl;
          String? universalUrl;
          double sizeMb = 0.0;

          for (final a in assets) {
            final name = (a['name'] as String? ?? '').toLowerCase();
            if (name.endsWith('.apk')) {
              final url = a['browser_download_url'] as String?;
              final bytes = (a['size'] as num? ?? 0).toDouble();
              if (name.contains('arm64') && downloadUrl == null) {
                downloadUrl = url;
                sizeMb = bytes / (1024 * 1024);
              } else if (universalUrl == null) {
                universalUrl = url;
                if (sizeMb == 0.0) sizeMb = bytes / (1024 * 1024);
              }
            }
          }

          downloadUrl ??= universalUrl;

          if (downloadUrl != null) {
            return UpdateInfo(
              tagName: tagName,
              cleanVersion: cleanRemote,
              versionCode: remoteBuild,
              title: data['name'] as String? ?? 'नया संस्करण $tagName',
              notes: bodyNotes,
              downloadUrl: downloadUrl,
              universalUrl: universalUrl,
              sizeMb: sizeMb > 0 ? sizeMb : 35.0,
              isMandatory: isMandatory,
            );
          }
        }
      }
    } catch (e) {
      debugPrint('GitHub release check note: $e');
    }
    return null;
  }

  /// Check for updates and present dialog if available with background throttling
  static Future<void> checkForUpdates(
    BuildContext context, {
    bool silent = true,
  }) async {
    if (_isChecking) return;
    _isChecking = true;

    try {
      // Throttle silent checks to prevent redundant network requests
      if (silent) {
        final prefs = await SharedPreferences.getInstance();
        final lastCheck = prefs.getInt(keyLastOtaCheck) ?? 0;
        final now = DateTime.now().millisecondsSinceEpoch;
        if (now - lastCheck < throttleIntervalMs) {
          _isChecking = false;
          return;
        }
      }

      final update = await getLatestUpdate(ignoreThrottle: !silent);
      _isChecking = false;

      // Update last checked timestamp
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt(keyLastOtaCheck, DateTime.now().millisecondsSinceEpoch);

      if (!context.mounted) return;

      if (update != null) {
        showUpdateDialog(context, update);
      } else if (!silent) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text(
              '🎉 आप नवीनतम संस्करण का उपयोग कर रहे हैं।',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontSize: 13),
            ),
            backgroundColor: const Color(0xFF141724),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const BorderSide(color: Color(0x33FFB800)),
            ),
          ),
        );
      }
    } catch (_) {
      _isChecking = false;
    }
  }

  /// Show the sacred dark gilded update dialog
  static void showUpdateDialog(BuildContext context, UpdateInfo update) {
    showDialog(
      context: context,
      barrierDismissible: !update.isMandatory,
      builder: (ctx) => UpdateDialog(update: update),
    );
  }
}
