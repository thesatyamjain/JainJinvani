import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';
import 'services/local_asset_server.dart';
import 'services/update_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Dark immersive edge-to-edge status bar & navigation bar
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF05060A),
      systemNavigationBarIconBrightness: Brightness.light,
      systemNavigationBarDividerColor: Colors.transparent,
    ),
  );

  runApp(const JainJinvaniApp());
}

class JainJinvaniApp extends StatelessWidget {
  const JainJinvaniApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'जिनवाणी',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF05060A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFFFB800),
          surface: Color(0xFF05060A),
        ),
      ),
      home: const WebAppShell(),
    );
  }
}

class WebAppShell extends StatefulWidget {
  const WebAppShell({super.key});

  @override
  State<WebAppShell> createState() => _WebAppShellState();
}

class _WebAppShellState extends State<WebAppShell> {
  final LocalAssetServer _server = LocalAssetServer();
  WebViewController? _controller;
  String? _errorMessage;
  DateTime? _lastBackPressTime;
  Timer? _updateTimer;

  @override
  void initState() {
    super.initState();
    _initController();
    _startServerAndLoad();

    // Check for OTA updates silently in the background after launch
    _updateTimer = Timer(const Duration(seconds: 4), () {
      if (mounted) {
        UpdateService.checkForUpdates(context, silent: true);
      }
    });
  }

  void _initController() {
    try {
      final controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(const Color(0xFF05060A))
        ..setUserAgent('JainJinvaniApp/1.0.1 (Android; Mobile)')
        ..setNavigationDelegate(
          NavigationDelegate(
            onWebResourceError: (WebResourceError error) {
              debugPrint('WebResource error: ${error.errorCode} - ${error.description}');
              if (error.isForMainFrame ?? false) {
                if (mounted) {
                  setState(() {
                    _errorMessage = 'लोड करने में असमर्थ (${error.errorCode}): ${error.description}';
                  });
                }
              }
            },
          ),
        )
        ..addJavaScriptChannel(
          'JinvaniNative',
          onMessageReceived: (JavaScriptMessage message) {
            if (message.message == 'check_update') {
              UpdateService.checkForUpdates(context, silent: false);
            }
          },
        );

      if (controller.platform is AndroidWebViewController) {
        final androidController = controller.platform as AndroidWebViewController;
        AndroidWebViewController.enableDebugging(false);
        androidController.setMediaPlaybackRequiresUserGesture(false);
      }

      _controller = controller;
    } catch (e) {
      debugPrint('Controller init note: $e');
      if (mounted) {
        setState(() {
          _errorMessage = e.toString();
        });
      }
    }
  }

  Future<void> _startServerAndLoad() async {
    try {
      final port = await _server.start();
      if (_controller != null) {
        await _controller!.loadRequest(
          Uri.parse('http://127.0.0.1:$port/index.html'),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString();
        });
      }
    }
  }

  @override
  void dispose() {
    _updateTimer?.cancel();
    _server.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) async {
        if (didPop) return;
        if (_controller != null && await _controller!.canGoBack()) {
          await _controller!.goBack();
          return;
        }

        final now = DateTime.now();
        if (_lastBackPressTime == null ||
            now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
          _lastBackPressTime = now;
          if (context.mounted) {
            ScaffoldMessenger.of(context).removeCurrentSnackBar();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text(
                  'ऐप बंद करने के लिए दोबारा बैक दबाएं',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                backgroundColor: const Color(0xFF141724),
                duration: const Duration(seconds: 2),
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: const BorderSide(color: Color(0x33FFB800)),
                ),
                margin: const EdgeInsets.only(bottom: 24, left: 48, right: 48),
              ),
            );
          }
        } else {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF05060A),
        body: SafeArea(
          top: false,
          bottom: false,
          child: Stack(
            children: [
              if (_errorMessage == null && _controller != null)
                WebViewWidget(controller: _controller!)
              else if (_errorMessage != null)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.error_outline,
                          size: 48,
                          color: Color(0xFFFFB800),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'लोड करने में समस्या आई',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _errorMessage!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13,
                            color: Colors.white70,
                          ),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: () {
                            setState(() {
                              _isLoading = true;
                              _errorMessage = null;
                            });
                            _startServerAndLoad();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFFB800),
                            foregroundColor: Colors.black,
                          ),
                          child: const Text('पुनः प्रयास करें'),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
