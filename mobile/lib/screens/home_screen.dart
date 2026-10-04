import 'package:flutter/material.dart';
import '../services/data_repository.dart';
import '../theme/app_theme.dart';
import '../widgets/home_sections.dart';

class HomeScreen extends StatelessWidget {
  final Function(int) onNavigateTab;

  const HomeScreen({super.key, required this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final repo = DataRepository();
    final tirthankaras = repo.getAllTirthankaras();
    final festivals = repo.getFestivals();

    if (repo.initError != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, color: AppTheme.goldLight, size: 48),
              const SizedBox(height: 16),
              const Text(
                'डेटा लोड करने में समस्या आई',
                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                repo.initError!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white60, fontSize: 12),
              ),
            ],
          ),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Hero Header Banner
          const HeroHeader(),
          const SizedBox(height: 20),

          // 2. Daily Vichar / Suvichar Card
          const DailyThoughtCard(),
          const SizedBox(height: 24),

          // 3. Quick Sadhana Actions
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'नित्य साधना',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
              TextButton(
                onPressed: () => onNavigateTab(1), // Sadhana tab
                child: const Text('सभी देखें →', style: TextStyle(color: AppTheme.goldLight, fontSize: 13)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const QuickSadhanaGrid(),
          const SizedBox(height: 28),

          // 4. Scripture Categories (2-Column Grid per Mobile Guidelines)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'पवित्र जिनवाणी संग्रह',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
              TextButton(
                onPressed: () => onNavigateTab(2), // Library tab
                child: const Text('ग्रंथालय →', style: TextStyle(color: AppTheme.goldLight, fontSize: 13)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const CategoryGrid(),
          const SizedBox(height: 28),

          // 5. Featured २४ तीर्थंकर
          if (tirthankaras.isNotEmpty) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  '२४ तीर्थंकर दर्शन',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary,
                  ),
                ),
                TextButton(
                  onPressed: () => onNavigateTab(3), // Tirthankar tab
                  child: const Text('सम्पूर्ण २४ →', style: TextStyle(color: AppTheme.goldLight, fontSize: 13)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TirthankarHorizontalList(list: tirthankaras),
            const SizedBox(height: 28),
          ],

          // 6. Upcoming Festivals (पर्व व उत्सव)
          if (festivals.isNotEmpty) ...[
            const Text(
              'आगामी जैन पर्व व तिथियाँ',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            FestivalsList(festivals: festivals),
            const SizedBox(height: 20),
          ],
        ],
      ),
    );
  }
}
