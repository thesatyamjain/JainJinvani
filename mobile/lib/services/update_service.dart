import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';
import '../widgets/update_dialog.dart';

class UpdateInfo {
  final String tagName;
  final String cleanVersion;
  final String title;
  final String notes;
  final String downloadUrl;
  final double sizeMb;

  UpdateInfo({
    required this.tagName,
    required this.cleanVersion,
    required this.title,
    required this.notes,
    required this.downloadUrl,
    required this.sizeMb,
  });
}

class UpdateService {
  static const String repoOwner = 'thesatyamjain';
  static const String repoName = 'jainjinvani';
  static bool _isChecking = false;

  /// Check for updates with dual source:
  /// 1. Cloudflare Pages fast JSON mirror (zero rate limits, instantaneous CDN)
  /// 2. GitHub Releases API (standard fallback)
  static Future<UpdateInfo?> getLatestUpdate() async {
    try {
      final packageInfo = await PackageInfo.fromPlatform();
      final currentVersion = packageInfo.version.replaceAll(RegExp(r'[^0-9.]'), '');
      debugPrint('Current App Version: $currentVersion');

      // 1. Primary check: Cloudflare Pages fast JSON manifest
      final cfUpdate = await _checkFromCloudflarePages(currentVersion);
      if (cfUpdate != null) {
        debugPrint('OTA Update available via Cloudflare Pages: ${cfUpdate.cleanVersion}');
        return cfUpdate;
      }

      // 2. Fallback check: GitHub Releases REST API
      final ghUpdate = await _checkFromGitHub(currentVersion);
      if (ghUpdate != null) {
        debugPrint('OTA Update available via GitHub Releases: ${ghUpdate.cleanVersion}');
        return ghUpdate;
      }
    } catch (e) {
      debugPrint('Update check note: $e');
    }
    return null;
  }

  static Future<UpdateInfo?> _checkFromCloudflarePages(String currentVersion) async {
    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 6);
      final uri = Uri.parse('https://jainjinvani.pages.dev/version.json');
      final request = await client.getUrl(uri);
      request.headers.set('User-Agent', 'JainJinvani-App');
      final response = await request.close();
      if (response.statusCode == 200) {
        final body = await response.transform(utf8.decoder).join();
        final data = jsonDecode(body) as Map<String, dynamic>;
        final version = data['version'] as String? ?? '';
        final cleanRemote = version.replaceAll(RegExp(r'[^0-9.]'), '');
        if (cleanRemote.isNotEmpty && _isNewerVersion(cleanRemote, currentVersion)) {
          final downloadUrl = data['downloadUrl'] as String? ?? '';
          if (downloadUrl.isNotEmpty) {
            return UpdateInfo(
              tagName: data['tagName'] as String? ?? 'v$cleanRemote',
              cleanVersion: cleanRemote,
              title: data['title'] as String? ?? 'नया संस्करण v$cleanRemote',
              notes: data['notes'] as String? ?? '',
              downloadUrl: downloadUrl,
              sizeMb: (data['sizeMb'] as num? ?? 35.0).toDouble(),
            );
          }
        }
      }
    } catch (e) {
      debugPrint('Cloudflare version check note: $e');
    }
    return null;
  }

  static Future<UpdateInfo?> _checkFromGitHub(String currentVersion) async {
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
        final cleanRemote = tagName.replaceAll(RegExp(r'[^0-9.]'), '');
        if (cleanRemote.isNotEmpty && _isNewerVersion(cleanRemote, currentVersion)) {
          final assets = data['assets'] as List<dynamic>? ?? [];
          String? downloadUrl;
          double sizeMb = 0.0;

          // 1st Priority: arm64 dedicated APK
          for (final a in assets) {
            final name = (a['name'] as String? ?? '').toLowerCase();
            if (name.endsWith('.apk') && name.contains('arm64')) {
              downloadUrl = a['browser_download_url'] as String?;
              sizeMb = ((a['size'] as num? ?? 0) / (1024 * 1024)).toDouble();
              break;
            }
          }

          // 2nd Priority: any .apk
          if (downloadUrl == null) {
            for (final a in assets) {
              final name = (a['name'] as String? ?? '').toLowerCase();
              if (name.endsWith('.apk')) {
                downloadUrl = a['browser_download_url'] as String?;
                sizeMb = ((a['size'] as num? ?? 0) / (1024 * 1024)).toDouble();
                break;
              }
            }
          }

          if (downloadUrl != null) {
            return UpdateInfo(
              tagName: tagName,
              cleanVersion: cleanRemote,
              title: data['name'] as String? ?? 'नया संस्करण $tagName',
              notes: data['body'] as String? ?? '',
              downloadUrl: downloadUrl,
              sizeMb: sizeMb,
            );
          }
        }
      }
    } catch (e) {
      debugPrint('GitHub release check note: $e');
    }
    return null;
  }

  /// Helper to compare version strings (e.g. "1.0.1" > "1.0.0")
  static bool _isNewerVersion(String remote, String current) {
    try {
      final rParts = remote.split('.').map((e) => int.tryParse(e) ?? 0).toList();
      final cParts = current.split('.').map((e) => int.tryParse(e) ?? 0).toList();

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
      return false;
    } catch (_) {
      return false;
    }
  }

  /// Check for updates and present dialog if available
  static Future<void> checkForUpdates(
    BuildContext context, {
    bool silent = true,
  }) async {
    if (_isChecking) return;
    _isChecking = true;

    try {
      final update = await getLatestUpdate();
      _isChecking = false;

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
      barrierDismissible: false,
      builder: (ctx) => UpdateDialog(update: update),
    );
  }
}

