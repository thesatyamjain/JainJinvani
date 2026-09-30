import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../widgets/space_background.dart';
import '../widgets/glass_card.dart';

class JapMalaScreen extends StatefulWidget {
  const JapMalaScreen({super.key});

  @override
  State<JapMalaScreen> createState() => _JapMalaScreenState();
}

class _JapMalaScreenState extends State<JapMalaScreen> {
  int _counter = 0;
  int _malasCompleted = 0;
  String _selectedMantra = 'namokar';

  final Map<String, Map<String, String>> _mantras = {
    'namokar': {
      'title': 'णमोकार महामंत्र',
      'lines': 'णमो अरिहंताणं\nणमो सिद्धाणं\nणमो आयरियाणं\nणमो उवज्झायाणं\nणमो लोए सव्व साहूणं',
      'meaning': 'अरिहंत, सिद्ध, आचार्य, उपाध्याय एवं सर्व साधुओं को नमस्कार हो।',
    },
    'panch_parmeshthi': {
      'title': 'पंचपरमेष्ठी स्मरण',
      'lines': 'ॐ ह्रीं श्रीं पंचपरमेष्ठिभ्यो नमः',
      'meaning': 'पंच परमेष्ठी भगवंतों को कोटि-कोटि नमन।',
    },
    'parshva': {
      'title': 'पार्श्वनाथ महामंत्र',
      'lines': 'ॐ ह्रीं श्रीं क्लीं ब्लूं श्री पार्श्वनाथाय नमः',
      'meaning': 'श्री चिंतामणि पार्श्वनाथ भगवान का बीज मंत्र।',
    },
    'shanti': {
      'title': 'शांति मंत्र',
      'lines': 'ॐ ह्रीं श्रीं क्लीं ऐं श्रीं शांतिनाथाय नमः',
      'meaning': 'सर्व विघ्न व उपद्रव शांत करने वाला मंगल पाठ।',
    },
  };

  void _increment() {
    HapticFeedback.lightImpact();
    setState(() {
      if (_counter < 108) {
        _counter++;
        if (_counter == 108) {
          HapticFeedback.heavyImpact();
          _malasCompleted++;
        }
      } else {
        _counter = 1;
      }
    });
  }

  void _reset() {
    HapticFeedback.mediumImpact();
    setState(() {
      _counter = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final activeMantra = _mantras[_selectedMantra]!;
    final double progress = _counter / 108.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('१०८ जाप माला'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.goldLight),
            tooltip: 'काउंटर रीसेट करें',
            onPressed: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  backgroundColor: AppTheme.surfaceElevated,
                  title: const Text('रीसेट की पुष्टि'),
                  content: const Text('क्या आप माला काउंटर को शून्य (०) पर रीसेट करना चाहते हैं?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('रद्द करें', style: TextStyle(color: AppTheme.textMuted)),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.gold),
                      onPressed: () {
                        _reset();
                        Navigator.pop(ctx);
                      },
                      child: const Text('रीसेट करें', style: TextStyle(color: Colors.black)),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: SpaceBackground(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            children: [
              // 1. Mala & Lap Counter Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.borderMedium),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.circle_rounded, size: 10, color: AppTheme.gold),
                        const SizedBox(width: 8),
                        Text(
                          'माला पूर्ण: $_malasCompleted माला',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.goldLight,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // 2. Big Touch Counter Bead Wheel
              GestureDetector(
                onTap: _increment,
                child: Container(
                  width: 240,
                  height: 240,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppTheme.surfaceCard,
                    border: Border.all(color: AppTheme.borderMedium, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.gold.withValues(alpha: 0.15),
                        blurRadius: 30,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Circular Progress Indicator
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
                      // Counter center text
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            '$_counter',
                            style: const TextStyle(
                              fontSize: 54,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.goldLight,
                              height: 1.0,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            '/ १०८ मनका',
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.textMuted,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: Colors.black45,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Text(
                              'स्पर्श करें',
                              style: TextStyle(fontSize: 11, color: AppTheme.gold),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // 3. Mantra Selector Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _mantras.keys.map((key) {
                    final isSelected = _selectedMantra == key;
                    final m = _mantras[key]!;
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4.0),
                      child: ChoiceChip(
                        label: Text(m['title']!),
                        selected: isSelected,
                        selectedColor: AppTheme.gold,
                        backgroundColor: AppTheme.surfaceElevated,
                        labelStyle: TextStyle(
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          color: isSelected ? Colors.black : AppTheme.textSecondary,
                        ),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        onSelected: (selected) {
                          if (selected) setState(() => _selectedMantra = key);
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 20),

              // 4. Active Mantra Display Box
              GlassCard(
                padding: const EdgeInsets.all(20),
                borderColor: AppTheme.borderMedium,
                child: Column(
                  children: [
                    Text(
                      activeMantra['title']!,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.goldLight,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      activeMantra['lines']!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                        height: 1.6,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      activeMantra['meaning']!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                        color: AppTheme.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
