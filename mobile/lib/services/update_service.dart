import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:ota_update/ota_update.dart';
import 'package:package_info_plus/package_info_plus.dart';

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

  /// Check GitHub Releases for updates
  static Future<UpdateInfo?> getLatestUpdate() async {
    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 10);
      final uri = Uri.parse(
        'https://api.github.com/repos/$repoOwner/$repoName/releases/latest',
      );
      final request = await client.getUrl(uri);
      request.headers.set('User-Agent', 'JainJinvani-App');
      request.headers.set('Accept', 'application/vnd.github.v3+json');

      final response = await request.close();
      if (response.statusCode != 200) {
        return null;
      }

      final responseBody = await response.transform(utf8.decoder).join();
      final data = jsonDecode(responseBody) as Map<String, dynamic>;

      final tagName = data['tag_name'] as String? ?? '';
      final cleanRemote = tagName.replaceAll(RegExp(r'[^0-9.]'), '');
      if (cleanRemote.isEmpty) return null;

      final packageInfo = await PackageInfo.fromPlatform();
      final currentVersion = packageInfo.version.replaceAll(RegExp(r'[^0-9.]'), '');

      // Compare semantic version (e.g. 1.0.1 vs 1.0.0)
      if (!_isNewerVersion(cleanRemote, currentVersion)) {
        return null;
      }

      // Find best APK asset (prefer arm64-v8a for modern phones, fallback to universal)
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

      if (downloadUrl == null) return null;

      return UpdateInfo(
        tagName: tagName,
        cleanVersion: cleanRemote,
        title: data['name'] as String? ?? 'नया संस्करण $tagName',
        notes: data['body'] as String? ?? '',
        downloadUrl: downloadUrl,
        sizeMb: sizeMb,
      );
    } catch (e) {
      debugPrint('Update check note: $e');
      return null;
    }
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
      builder: (ctx) => _UpdateDialog(update: update),
    );
  }
}

class _UpdateDialog extends StatefulWidget {
  final UpdateInfo update;
  const _UpdateDialog({required this.update});

  @override
  State<_UpdateDialog> createState() => _UpdateDialogState();
}

class _UpdateDialogState extends State<_UpdateDialog> {
  bool _isDownloading = false;
  String _progress = '0';
  String? _errorMessage;

  void _startOtaDownload() {
    setState(() {
      _isDownloading = true;
      _errorMessage = null;
      _progress = '0';
    });

    try {
      OtaUpdate().execute(
        widget.update.downloadUrl,
        destinationFilename: 'jain_jinvani_${widget.update.cleanVersion}.apk',
      ).listen(
        (OtaEvent event) {
          if (!mounted) return;
          if (event.status == OtaStatus.DOWNLOADING) {
            setState(() {
              _progress = event.value ?? '0';
            });
          } else if (event.status == OtaStatus.INSTALLING) {
            Navigator.of(context, rootNavigator: true).pop();
          } else if (event.status == OtaStatus.PERMISSION_NOT_GRANTED_ERROR) {
            setState(() {
              _isDownloading = false;
              _errorMessage = 'कृपया ऐप इंस्टॉल करने की अनुमति दें।';
            });
          } else if (event.status == OtaStatus.INTERNAL_ERROR ||
              event.status == OtaStatus.DOWNLOAD_ERROR) {
            setState(() {
              _isDownloading = false;
              _errorMessage = 'डाउनलोड करने में समस्या आई। पुनः प्रयास करें।';
            });
          }
        },
        onError: (e) {
          if (mounted) {
            setState(() {
              _isDownloading = false;
              _errorMessage = 'त्रुटि: $e';
            });
          }
        },
      );
    } catch (e) {
      if (mounted) {
        setState(() {
          _isDownloading = false;
          _errorMessage = 'त्रुटि: $e';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final progressVal = (double.tryParse(_progress) ?? 0.0) / 100.0;

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF0C101A),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0x44FFB800), width: 1.2),
          boxShadow: const [
            BoxShadow(
              color: Colors.black87,
              blurRadius: 36,
              spreadRadius: 4,
            ),
            BoxShadow(
              color: Color(0x1AFFB800),
              blurRadius: 24,
              spreadRadius: 0,
            ),
          ],
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Top Emblem Badge
            Center(
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2B1D08), Color(0xFF141724)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0x66FFB800)),
                ),
                child: const Icon(
                  Icons.system_update_rounded,
                  color: Color(0xFFFFB800),
                  size: 30,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Title
            Text(
              'नया संस्करण उपलब्ध है! ✨',
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.3,
              ),
            ),
            const SizedBox(height: 4),

            // Version & Size
            Text(
              'संस्करण ${widget.update.tagName}${widget.update.sizeMb > 0 ? " • ${widget.update.sizeMb.toStringAsFixed(1)} MB" : ""}',
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Color(0xFFFFB800),
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),

            // Content / Release highlights
            Container(
              constraints: const BoxConstraints(maxHeight: 120),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0x0AFFFFFF),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white10),
              ),
              child: SingleChildScrollView(
                child: Text(
                  widget.update.notes.isNotEmpty
                      ? widget.update.notes
                      : 'इस संस्करण में नए सुधार, तेज गति और शुद्ध जिनवाणी पाठ शामिल हैं।',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12.5,
                    height: 1.5,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Downloading Progress or Error
            if (_isDownloading) ...[
              Column(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: progressVal > 0 ? progressVal : null,
                      backgroundColor: Colors.white12,
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        Color(0xFFFFB800),
                      ),
                      minHeight: 8,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'डाउनलोड हो रहा है: $_progress%',
                    style: const TextStyle(
                      color: Color(0xFFFFB800),
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
            ],

            if (_errorMessage != null) ...[
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Color(0xFFFF6B6B),
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 12),
            ],

            // Actions
            if (!_isDownloading)
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context, rootNavigator: true).pop(),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white70,
                        side: const BorderSide(color: Colors.white24),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text('बाद में'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _startOtaDownload,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFB800),
                        foregroundColor: const Color(0xFF05060A),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text(
                        'अपडेट करें',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
