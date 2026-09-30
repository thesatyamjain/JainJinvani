import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/audio_service.dart';
import '../theme/app_theme.dart';
import '../widgets/space_background.dart';
import '../widgets/glass_card.dart';

class SamayikScreen extends StatefulWidget {
  const SamayikScreen({super.key});

  @override
  State<SamayikScreen> createState() => _SamayikScreenState();
}

class _SamayikScreenState extends State<SamayikScreen> {
  static const int _totalSeconds = 48 * 60; // 48 minutes
  int _secondsRemaining = _totalSeconds;
  Timer? _timer;
  bool _isRunning = false;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    HapticFeedback.mediumImpact();
    AppAudioService().playTempleBell();
    setState(() {
      _isRunning = true;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        setState(() {
          _secondsRemaining--;
          // Halfway bell at 24 mins
          if (_secondsRemaining == 24 * 60) {
            AppAudioService().playTempleBell();
          }
        });
      } else {
        _timer?.cancel();
        _isRunning = false;
        HapticFeedback.heavyImpact();
        AppAudioService().playTempleBell();
        _showCompletedDialog();
      }
    });
  }

  void _pauseTimer() {
    HapticFeedback.lightImpact();
    _timer?.cancel();
    setState(() {
      _isRunning = false;
    });
  }

  void _resetTimer() {
    HapticFeedback.mediumImpact();
    _timer?.cancel();
    setState(() {
      _isRunning = false;
      _secondsRemaining = _totalSeconds;
    });
  }

  void _showCompletedDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceElevated,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppTheme.gold),
        ),
        title: const Text('॥ सामायिक पूर्ण ॥', textAlign: TextAlign.center, style: TextStyle(color: AppTheme.goldLight)),
        content: const Text(
          'आपकी ४८ मिनट की सामायिक साधना सफलतापूर्वक संपन्न हुई।\n\n"खामेमि सव्वजीवे सव्वे जीवा खमंतु मे।\nमित्ती मे सव्वभूएंसु वेरं मज्झं न केणइ॥"',
          textAlign: TextAlign.center,
          style: TextStyle(height: 1.6, color: AppTheme.textPrimary),
        ),
        actions: [
          Center(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.gold),
              onPressed: () => Navigator.pop(ctx),
              child: const Text('उत्तम क्षमा', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(int totalSecs) {
    final m = (totalSecs ~/ 60).toString().padLeft(2, '0');
    final s = (totalSecs % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final double progress = (_totalSeconds - _secondsRemaining) / _totalSeconds.toDouble();

    return Scaffold(
      appBar: AppBar(
        title: const Text('सामायिक साधना (४८ मिनट)'),
      ),
      body: SpaceBackground(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            children: [
              // Intro Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.gold.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderMedium),
                ),
                child: const Text(
                  '॥ दो घड़ी समता ध्यान • आत्म शुद्धि ॥',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
                ),
              ),
              const SizedBox(height: 24),

              // Big Circular Countdown Clock
              Container(
                width: 240,
                height: 240,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.surfaceCard,
                  border: Border.all(color: AppTheme.borderMedium, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.gold.withValues(alpha: _isRunning ? 0.2 : 0.08),
                      blurRadius: 30,
                    ),
                  ],
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 220,
                      height: 220,
                      child: CircularProgressIndicator(
                        value: progress,
                        strokeWidth: 6,
                        backgroundColor: Colors.white10,
                        valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.gold),
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          _formatTime(_secondsRemaining),
                          style: const TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.goldLight,
                            letterSpacing: 2,
                            height: 1.0,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          _isRunning ? 'साधना जारी...' : (_secondsRemaining == _totalSeconds ? 'प्रारंभ करें' : 'विश्राम'),
                          style: const TextStyle(fontSize: 13, color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Timer Controls
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_isRunning)
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.amber[700],
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      icon: const Icon(Icons.pause_rounded, color: Colors.black),
                      label: const Text('रोकें (Pause)', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                      onPressed: _pauseTimer,
                    )
                  else
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.gold,
                        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      icon: const Icon(Icons.play_arrow_rounded, color: Colors.black),
                      label: const Text('प्रारंभ करें', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16)),
                      onPressed: _startTimer,
                    ),
                  const SizedBox(width: 14),
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppTheme.borderSubtle),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: const Icon(Icons.refresh_rounded, color: AppTheme.textMuted, size: 18),
                    label: const Text('रीसेट', style: TextStyle(color: AppTheme.textMuted)),
                    onPressed: _resetTimer,
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Samayik Pratigya (संकल्प पाठ)
              GlassCard(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: const [
                    Text(
                      'सामायिक प्रतिज्ञा (संकल्प)',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
                    ),
                    SizedBox(height: 10),
                    Text(
                      'करेमि भंते! सामाइयं, सावज्जं जोगं पच्चक्खामि।\nजाव नियमं पज्जुवासामि, दुविहं तिविहेणं मणेणं वायाए काएणं, न करेमि न कारवेमि।\nतस्स भंते! पडिक्कमामि, निंदामि गरिहामि अप्पाणं वोसिरामि॥',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppTheme.textPrimary, height: 1.6),
                    ),
                    SizedBox(height: 10),
                    Text(
                      'सरल भावार्थ: हे भगवन्! मैं सामायिक करता हूँ। जब तक मेरी सामायिक का समय है, तब तक मैं मन-वचन-काय से किसी भी सावद्य (पापयुक्त) कार्य को न करूँगा और न कराऊँगा।',
                      style: TextStyle(fontSize: 12, color: AppTheme.textMuted, height: 1.5),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // Iryavahi Sutra (इर्यावही सूत्र)
              GlassCard(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: const [
                    Text(
                      'इर्यावही सूत्र (मार्ग गमन शुद्धि)',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
                    ),
                    SizedBox(height: 10),
                    Text(
                      'इच्छाकारेण संदिसह भगवन्! इरियावहियं पडिक्कमामि?\nइच्छं, इच्छामि पडिक्कमिउं इरियावहियाए, विराहणाए, गमणागमणे।\nपाणक्कमणे, बीयक्कमणे, हरियक्कमणे, ओसा-उत्तिंग-पणग-दगमट्टी-मक्कड़ा-संताण-संकमणे॥',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppTheme.textSecondary, height: 1.6),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
