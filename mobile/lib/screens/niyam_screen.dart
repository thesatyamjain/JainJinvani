import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/niyam_service.dart';
import '../theme/app_theme.dart';
import '../widgets/space_background.dart';
import '../widgets/glass_card.dart';

class NiyamaScreen extends StatelessWidget {
  const NiyamaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final niyamService = NiyamService();

    return Scaffold(
      appBar: AppBar(
        title: const Text('दैनिक नियम व संकल्प'),
      ),
      body: SpaceBackground(
        child: ListenableBuilder(
          listenable: niyamService,
          builder: (context, _) {
            final completedCount = niyamService.completedCount;
            final totalCount = niyamService.totalCount;
            final progress = niyamService.progress;
            final streak = niyamService.streak;

            return ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              children: [
                // 1. Progress & Streak Card
                GlassCard(
                  padding: const EdgeInsets.all(20),
                  borderColor: AppTheme.borderMedium,
                  child: Row(
                    children: [
                      // Circular indicator
                      SizedBox(
                        width: 74,
                        height: 74,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            CircularProgressIndicator(
                              value: progress,
                              strokeWidth: 6,
                              backgroundColor: Colors.white10,
                              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.gold),
                            ),
                            Text(
                              '${(progress * 100).toInt()}%',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.goldLight,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'आज के नियम: $completedCount / $totalCount पूर्ण',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                const Text('🔥', style: TextStyle(fontSize: 14)),
                                const SizedBox(width: 6),
                                Text(
                                  'निरंतर साधना स्ट्रीक: $streak दिन',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppTheme.goldLight,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'नियम से ही जीवन में संयम और शांति आती है।',
                              style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // 2. Section Header
                const Text(
                  'श्रावक के मंगल आचार संकल्प',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.goldLight,
                  ),
                ),
                const SizedBox(height: 12),

                // 3. Vows List
                for (final item in NiyamService.defaultNiyams) ...[
                  Padding(
                    padding: const EdgeInsets.only(bottom: 10.0),
                    child: GlassCard(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      onTap: () {
                        HapticFeedback.lightImpact();
                        niyamService.toggle(item.id);
                      },
                      borderColor: niyamService.isCompleted(item.id)
                          ? AppTheme.gold.withValues(alpha: 0.4)
                          : AppTheme.borderSubtle,
                      child: Row(
                        children: [
                          Text(item.icon, style: const TextStyle(fontSize: 24)),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.title,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: niyamService.isCompleted(item.id)
                                        ? AppTheme.goldLight
                                        : AppTheme.textPrimary,
                                    decoration: niyamService.isCompleted(item.id)
                                        ? TextDecoration.none
                                        : TextDecoration.none,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  item.description,
                                  style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                                ),
                              ],
                            ),
                          ),
                          Checkbox(
                            value: niyamService.isCompleted(item.id),
                            activeColor: AppTheme.gold,
                            checkColor: Colors.black,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                            side: const BorderSide(color: AppTheme.borderSubtle, width: 1.5),
                            onChanged: (val) {
                              HapticFeedback.lightImpact();
                              niyamService.toggle(item.id);
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            );
          },
        ),
      ),
    );
  }
}
