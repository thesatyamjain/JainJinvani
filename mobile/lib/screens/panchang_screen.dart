import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/data_repository.dart';
import '../theme/app_theme.dart';
import '../widgets/space_background.dart';
import '../widgets/glass_card.dart';

class PanchangScreen extends StatelessWidget {
  const PanchangScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final dateStr = DateFormat('dd MMMM yyyy, EEEE', 'hi_IN').format(now);
    final repo = DataRepository();
    final festivals = repo.getFestivals();

    // Calculate approximate Veer Nirvana Samvat & Vikram Samvat
    final vikramSamvat = now.year + 57;
    final veerSamvat = now.year + 527;

    return Scaffold(
      appBar: AppBar(
        title: const Text('जैन पंचांग व पर्व निर्णय'),
      ),
      body: SpaceBackground(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          children: [
            // 1. Current Date Banner
            GlassCard(
              padding: const EdgeInsets.all(20),
              borderColor: AppTheme.borderMedium,
              child: Column(
                children: [
                  const Text('卐', style: TextStyle(fontSize: 28, color: AppTheme.goldLight)),
                  const SizedBox(height: 6),
                  Text(
                    dateStr,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildPanchangBadge('वीर निर्वाण संवत्', '$veerSamvat'),
                      _buildPanchangBadge('विक्रम संवत्', '$vikramSamvat'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 2. Parva Tithi Alert (अष्टमी / चतुर्दशी)
            const GlassCard(
              padding: EdgeInsets.all(14),
              child: Row(
                children: [
                  Text('🌙', style: TextStyle(fontSize: 24)),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'पर्व तिथियाँ (अष्टमी व चतुर्दशी)',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'महीने की दोनों अष्टमी व चतुर्दशी को उपवास अथवा एकासन कर ब्रह्मचर्य का पालन करें।',
                          style: TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 3. Surya-Kala (Sunrise / Sunset Guide for Night Eating)
            const GlassCard(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.wb_sunny_rounded, color: AppTheme.goldLight, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'सूर्योदय एवं सूर्यास्त मर्यादा',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                    ],
                  ),
                  SizedBox(height: 10),
                  Text(
                    'सूर्यास्त से २ घड़ी (४८ मिनट) पूर्व ही भोजन एवं जल ग्रहण कर लेना चाहिए। रात्रि में चारों प्रकार के आहार का त्याग ही जैन धर्म का मूल आधार है।',
                    style: TextStyle(fontSize: 12, color: AppTheme.textMuted, height: 1.5),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 4. Festivals Listing
            const Text(
              'वार्षिक जैन महापर्व व उत्सव',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
            ),
            const SizedBox(height: 12),

            for (final f in festivals) ...[
              Padding(
                padding: const EdgeInsets.only(bottom: 10.0),
                child: GlassCard(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: AppTheme.gold.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Center(
                          child: Icon(Icons.event_note_rounded, color: AppTheme.goldLight, size: 20),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              f.nameHindi,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              f.descriptionHindi,
                              style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPanchangBadge(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.surfaceElevated,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
          const SizedBox(height: 2),
          Text(
            value,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: AppTheme.goldLight,
            ),
          ),
        ],
      ),
    );
  }
}
