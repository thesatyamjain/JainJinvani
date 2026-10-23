import 'dart:io';
import 'package:flutter/material.dart';
import 'package:ota_update/ota_update.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/update_service.dart';

class UpdateDialog extends StatefulWidget {
  final UpdateInfo update;

  const UpdateDialog({super.key, required this.update});

  @override
  State<UpdateDialog> createState() => _UpdateDialogState();
}

class _UpdateDialogState extends State<UpdateDialog> {
  bool _isDownloading = false;
  bool _isInstalling = false;
  String _progress = '0';
  String? _errorMessage;

  Future<void> _launchBrowserDownload() async {
    try {
      final uri = Uri.parse(widget.update.downloadUrl);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('Launch browser error: $e');
    }
  }

  Future<void> _launchAppStore() async {
    try {
      final url = widget.update.appStoreUrl ?? 'https://apps.apple.com/app/jain-jinvani';
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('Launch App Store error: $e');
    }
  }

  void _startOtaDownload() {
    // On iOS, OTA binary installation is prohibited by App Store guidelines
    if (Platform.isIOS) {
      _launchAppStore();
      return;
    }

    setState(() {
      _isDownloading = true;
      _isInstalling = false;
      _errorMessage = null;
      _progress = '0';
    });

    try {
      OtaUpdate().execute(
        widget.update.downloadUrl,
        destinationFilename: 'jain_jinvani_${widget.update.cleanVersion}.apk',
        sha256checksum: widget.update.sha256 != null && widget.update.sha256!.isNotEmpty
            ? widget.update.sha256
            : null,
      ).listen(
        (OtaEvent event) {
          if (!mounted) return;
          if (event.status == OtaStatus.DOWNLOADING) {
            setState(() {
              _progress = event.value ?? '0';
            });
          } else if (event.status == OtaStatus.INSTALLING) {
            setState(() {
              _isDownloading = false;
              _isInstalling = true;
            });
            Future.delayed(const Duration(seconds: 4), () {
              if (mounted && _isInstalling && !widget.update.isMandatory) {
                Navigator.of(context, rootNavigator: true).pop();
              }
            });
          } else if (event.status == OtaStatus.PERMISSION_NOT_GRANTED_ERROR) {
            setState(() {
              _isDownloading = false;
              _isInstalling = false;
              _errorMessage =
                  'कृपया ऐप को \'Install unknown apps\' अनुमति दें, या नीचे दिए गए बटन से सीधे डाउनलोड करें।';
            });
          } else if (event.status == OtaStatus.CHECKSUM_ERROR) {
            setState(() {
              _isDownloading = false;
              _isInstalling = false;
              _errorMessage =
                  'पैकेज अखंडता (Checksum) मिलान में त्रुटि हुई। कृपया नीचे से सुरक्षित डाउनलोड करें।';
            });
          } else if (event.status == OtaStatus.INTERNAL_ERROR ||
              event.status == OtaStatus.DOWNLOAD_ERROR) {
            setState(() {
              _isDownloading = false;
              _isInstalling = false;
              _errorMessage =
                  'डाउनलोड में समस्या आई। नीचे दिए गए बटन से ब्राउज़र में सीधे डाउनलोड करें।';
            });
          }
        },
        onError: (e) {
          if (mounted) {
            setState(() {
              _isDownloading = false;
              _errorMessage = 'त्रुटि ($e)। नीचे दिए गए बटन से ब्राउज़र में डाउनलोड करें।';
            });
          }
        },
      );
    } catch (e) {
      if (mounted) {
        setState(() {
          _isDownloading = false;
          _errorMessage = 'त्रुटि ($e)। कृपया ब्राउज़र से डाउनलोड करें।';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final progressVal = (double.tryParse(_progress) ?? 0.0) / 100.0;
    final isMandatory = widget.update.isMandatory;
    final isIOS = Platform.isIOS;

    return PopScope(
      canPop: !isMandatory && !_isDownloading && !_isInstalling,
      child: Dialog(
        backgroundColor: Colors.transparent,
        elevation: 0,
        insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFF0C101A),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: isMandatory ? const Color(0x66EF4444) : const Color(0x44FFB800),
              width: 1.2,
            ),
            boxShadow: [
              const BoxShadow(
                color: Colors.black87,
                blurRadius: 36,
                spreadRadius: 4,
              ),
              BoxShadow(
                color: isMandatory ? const Color(0x22EF4444) : const Color(0x1AFFB800),
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
                    gradient: LinearGradient(
                      colors: isMandatory
                          ? [const Color(0xFF3B0D0D), const Color(0xFF1F1014)]
                          : [const Color(0xFF2B1D08), const Color(0xFF141724)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isMandatory ? const Color(0x88EF4444) : const Color(0x66FFB800),
                    ),
                  ),
                  child: Icon(
                    isMandatory ? Icons.warning_amber_rounded : Icons.system_update_rounded,
                    color: isMandatory ? const Color(0xFFEF4444) : const Color(0xFFFFB800),
                    size: 30,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Title
              Text(
                isMandatory ? 'अत्यावश्यक सुरक्षा अपडेट 🚨' : 'नया संस्करण उपलब्ध है! ✨',
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
                style: TextStyle(
                  color: isMandatory ? const Color(0xFFFCA5A5) : const Color(0xFFFFB800),
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
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (isMandatory) ...[
                        const Text(
                          'महत्वपूर्ण: यह एक अनिवार्य अपडेट है। सुचारू सेवा और सुरक्षा हेतु ऐप को तुरंत अपडेट करें।',
                          style: TextStyle(
                            color: Color(0xFFFCA5A5),
                            fontWeight: FontWeight.bold,
                            fontSize: 12.5,
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 6),
                      ],
                      Text(
                        widget.update.notes.isNotEmpty
                            ? widget.update.notes
                            : 'इस संस्करण में नए सुधार, तेज गति और शुद्ध जिनवाणी पाठ शामिल हैं।',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 12.5,
                          height: 1.5,
                        ),
                      ),
                    ],
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
                        valueColor: AlwaysStoppedAnimation<Color>(
                          isMandatory ? const Color(0xFFEF4444) : const Color(0xFFFFB800),
                        ),
                        minHeight: 8,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'डाउनलोड हो रहा है: $_progress%',
                          style: TextStyle(
                            color: isMandatory ? const Color(0xFFFCA5A5) : const Color(0xFFFFB800),
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if (widget.update.sizeMb > 0)
                          Text(
                            '${(progressVal * widget.update.sizeMb).toStringAsFixed(1)} / ${widget.update.sizeMb.toStringAsFixed(1)} MB',
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 11.5,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),
              ],

              if (_isInstalling) ...[
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0x1A22C55E),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0x4422C55E)),
                  ),
                  child: const Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.check_circle_rounded, color: Color(0xFF22C55E), size: 20),
                          SizedBox(width: 8),
                          Text(
                            'डाउनलोड पूर्ण हुआ! ✨',
                            style: TextStyle(
                              color: Color(0xFF22C55E),
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      Text(
                        'सिस्टम पैकेज इंस्टॉलर शुरू किया जा रहा है। यदि स्क्रीन बंद हो जाए, तो फ़ोन की नोटिफिकेशन बार (Notification Bar) देखें।',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: _launchBrowserDownload,
                  icon: const Icon(Icons.install_mobile_rounded, size: 18),
                  label: const Text('ब्राउज़र से सीधा इंस्टॉल करें'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFFB800),
                    foregroundColor: const Color(0xFF05060A),
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
                if (!isMandatory) ...[
                  const SizedBox(height: 8),
                  Center(
                    child: TextButton(
                      onPressed: () => Navigator.of(context, rootNavigator: true).pop(),
                      child: const Text('बंद करें', style: TextStyle(color: Colors.white54, fontSize: 12)),
                    ),
                  ),
                ],
              ] else if (_errorMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0x1AFF6B6B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0x44FF6B6B)),
                  ),
                  child: Text(
                    _errorMessage!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Color(0xFFFF9E9E),
                      fontSize: 12,
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: _launchBrowserDownload,
                  icon: const Icon(Icons.open_in_browser_rounded, size: 18),
                  label: const Text('ब्राउज़र से APK डाउनलोड करें'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFFB800),
                    foregroundColor: const Color(0xFF05060A),
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextButton.icon(
                      onPressed: _startOtaDownload,
                      icon: const Icon(Icons.refresh_rounded, size: 16, color: Colors.white70),
                      label: const Text('पुनः प्रयास करें', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    ),
                    if (!isMandatory) ...[
                      const SizedBox(width: 8),
                      TextButton(
                        onPressed: () => Navigator.of(context, rootNavigator: true).pop(),
                        child: const Text('बंद करें', style: TextStyle(color: Colors.white54, fontSize: 12)),
                      ),
                    ],
                  ],
                ),
              ] else if (!_isDownloading && !_isInstalling) ...[
                if (isIOS) ...[
                  ElevatedButton.icon(
                    onPressed: _launchAppStore,
                    icon: const Icon(Icons.open_in_new_rounded, size: 18),
                    label: const Text('App Store पर अपडेट करें'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFFB800),
                      foregroundColor: const Color(0xFF05060A),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                  ),
                  if (!isMandatory) ...[
                    const SizedBox(height: 8),
                    Center(
                      child: TextButton(
                        onPressed: () => Navigator.of(context, rootNavigator: true).pop(),
                        child: const Text('बाद में', style: TextStyle(color: Colors.white54, fontSize: 12)),
                      ),
                    ),
                  ],
                ] else ...[
                  Row(
                    children: [
                      if (!isMandatory) ...[
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
                      ],
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _startOtaDownload,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isMandatory ? const Color(0xFFEF4444) : const Color(0xFFFFB800),
                            foregroundColor: isMandatory ? Colors.white : const Color(0xFF05060A),
                            padding: const EdgeInsets.symmetric(vertical: 13),
                            elevation: 4,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          child: Text(
                            isMandatory ? 'तुरंत अपडेट करें' : 'अपडेट करें',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Center(
                    child: TextButton.icon(
                      onPressed: _launchBrowserDownload,
                      icon: const Icon(Icons.download_rounded, size: 14, color: Colors.white54),
                      label: const Text(
                        'या ब्राउज़र से सीधे डाउनलोड करें',
                        style: TextStyle(
                          color: Colors.white54,
                          fontSize: 11.5,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ],
          ),
        ),
      ),
    );
  }
}
