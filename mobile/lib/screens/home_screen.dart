import 'package:flutter/material.dart';
import '../services/data_repository.dart';
import '../models/tirthankar.dart';
import '../models/festival.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';
import 'category_screen.dart';
import 'viewer_screen.dart';
import 'jap_mala_screen.dart';
import 'samayik_screen.dart';
import 'niyam_screen.dart';
import 'panchang_screen.dart';
import 'tirthankar_screen.dart';

class HomeScreen extends StatelessWidget {
  final Function(int) onNavigateTab;

  const HomeScreen({super.key, required this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final repo = DataRepository();
    final tirthankaras = repo.getAllTirthankaras();
    final festivals = repo.getFestivals();

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Hero Header Banner
          _buildHeroHeader(context),
          const SizedBox(height: 20),

          // 2. Daily Vichar / Suvichar Card
          _buildDailyThoughtCard(),
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
          _buildQuickSadhanaGrid(context),
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
          _buildCategoryGrid(context),
          const SizedBox(height: 28),

          // 5. Featured २४ तीर्थंकर
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
          _buildTirthankarHorizontal(context, tirthankaras),
          const SizedBox(height: 28),

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
            _buildFestivalsList(festivals),
            const SizedBox(height: 20),
          ],
        ],
      ),
    );
  }

  Widget _buildHeroHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0x33F59E0B), Color(0x111E293B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderMedium, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppTheme.gold.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppTheme.goldLight, width: 1.5),
                ),
                child: const Center(
                  child: Text('卐', style: TextStyle(fontSize: 22, color: AppTheme.goldLight)),
                ),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'जैन जिनवाणी',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                        letterSpacing: -0.3,
                      ),
                    ),
                    Text(
                      'सम्पूर्ण दिगम्बर जैन आगम व साधना',
                      style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Namokar Mantra fast launch
          InkWell(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => const ViewerScreen(
                    contentId: 'namokar-mantra',
                    contentTitle: 'णमोकार मंत्र',
                    category: 'stotra',
                  ),
                ),
              );
            },
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.black38,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.borderSubtle),
              ),
              child: const Row(
                children: [
                  Icon(Icons.auto_awesome_rounded, color: AppTheme.goldLight, size: 18),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'णमो अरिहंताणं • णमो सिद्धाणं • णमो आयरियाणं',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 13, color: AppTheme.goldLight, fontWeight: FontWeight.w500),
                    ),
                  ),
                  Icon(Icons.arrow_forward_ios_rounded, color: AppTheme.textMuted, size: 12),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDailyThoughtCard() {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      borderColor: AppTheme.borderSubtle,
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('✨', style: TextStyle(fontSize: 24)),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'आज का विचार',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.goldLight,
                    letterSpacing: 0.5,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'परम क्षमा ही धर्म का प्रथम द्वार है। जो क्रोध को शांत करता है, वही सच्चा वीतरागी है।',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppTheme.textSecondary,
                    height: 1.5,
                  ),
                ),
                SizedBox(height: 6),
                Text(
                  '— आचार्य कुन्दकुन्द स्वामी (समयसार)',
                  style: TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: AppTheme.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickSadhanaGrid(BuildContext context) {
    final actions = [
      {
        'title': '१०८ जाप माला',
        'subtitle': 'डिजिटल मनका जाप',
        'icon': '📿',
        'action': () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const JapMalaScreen())),
      },
      {
        'title': 'सामायिक साधना',
        'subtitle': '४८ मिनट समता ध्यान',
        'icon': '🧘',
        'action': () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const SamayikScreen())),
      },
      {
        'title': 'दैनिक नियम',
        'subtitle': '८ मंगल आचार संकल्प',
        'icon': '✅',
        'action': () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const NiyamaScreen())),
      },
      {
        'title': 'जैन पंचांग',
        'subtitle': 'तिथि, पक्ष व पर्व',
        'icon': '📅',
        'action': () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const PanchangScreen())),
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.6,
      ),
      itemCount: actions.length,
      itemBuilder: (context, index) {
        final a = actions[index];
        return GlassCard(
          padding: const EdgeInsets.all(12),
          onTap: a['action'] as VoidCallback,
          child: Row(
            children: [
              Text(a['icon'] as String, style: const TextStyle(fontSize: 26)),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      a['title'] as String,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      a['subtitle'] as String,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCategoryGrid(BuildContext context) {
    final categories = [
      {'id': 'puja', 'name': 'पूजा व विधान', 'icon': '🛕', 'count': '२२८+'},
      {'id': 'stotra', 'name': 'स्तोत्र संग्रह', 'icon': '📜', 'count': '३९+'},
      {'id': 'arti', 'name': 'आरती संग्रह', 'icon': '🪔', 'count': '३३+'},
      {'id': 'chalisa', 'name': 'चालीसा संग्रह', 'icon': '📖', 'count': '३८+'},
      {'id': 'bhajan', 'name': 'भजन व भक्ति', 'icon': '🎵', 'count': '४६+'},
      {'id': 'shastra', 'name': 'शास्त्र व आगम', 'icon': '📚', 'count': '४२+'},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.5,
      ),
      itemCount: categories.length,
      itemBuilder: (context, index) {
        final cat = categories[index];
        return GlassCard(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => CategoryScreen(
                  categoryId: cat['id']!,
                  categoryTitle: cat['name']!,
                ),
              ),
            );
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(cat['icon']!, style: const TextStyle(fontSize: 22)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      cat['count']!,
                      style: const TextStyle(fontSize: 10, color: AppTheme.goldLight, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
              Text(
                cat['name']!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTirthankarHorizontal(BuildContext context, List<Tirthankar> list) {
    if (list.isEmpty) return const SizedBox.shrink();

    return SizedBox(
      height: 120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: list.length,
        itemBuilder: (context, index) {
          final t = list[index];
          return Container(
            width: 130,
            margin: const EdgeInsets.only(right: 12),
            child: GlassCard(
              padding: const EdgeInsets.all(10),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => TirthankarScreen(initialTirthankarId: t.id),
                  ),
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(t.symbolEmoji, style: const TextStyle(fontSize: 24)),
                  const SizedBox(height: 6),
                  Text(
                    '${t.number}. ${t.nameHindi.replaceAll("श्री ", "").replaceAll(" भगवान", "")}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    t.symbol,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFestivalsList(List<JainFestival> festivals) {
    return Column(
      children: festivals.take(3).map((f) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 8.0),
          child: GlassCard(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: AppTheme.saffron.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.saffron.withValues(alpha: 0.3)),
                  ),
                  child: const Center(
                    child: Icon(Icons.celebration_rounded, color: AppTheme.goldLight, size: 20),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        f.nameHindi,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        f.descriptionHindi,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
