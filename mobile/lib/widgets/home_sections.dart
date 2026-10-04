import 'package:flutter/material.dart';
import '../models/tirthankar.dart';
import '../models/festival.dart';
import '../theme/app_theme.dart';
import 'glass_card.dart';
import '../screens/category_screen.dart';
import '../screens/viewer_screen.dart';
import '../screens/jap_mala_screen.dart';
import '../screens/samayik_screen.dart';
import '../screens/niyam_screen.dart';
import '../screens/panchang_screen.dart';
import '../screens/tirthankar_screen.dart';

class HeroHeader extends StatelessWidget {
  const HeroHeader({super.key});

  @override
  Widget build(BuildContext context) {
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
}

class DailyThoughtCard extends StatelessWidget {
  const DailyThoughtCard({super.key});

  @override
  Widget build(BuildContext context) {
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
}

class QuickSadhanaGrid extends StatelessWidget {
  const QuickSadhanaGrid({super.key});

  @override
  Widget build(BuildContext context) {
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
}

class CategoryGrid extends StatelessWidget {
  const CategoryGrid({super.key});

  @override
  Widget build(BuildContext context) {
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
}

class TirthankarHorizontalList extends StatelessWidget {
  final List<Tirthankar> list;

  const TirthankarHorizontalList({super.key, required this.list});

  @override
  Widget build(BuildContext context) {
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
}

class FestivalsList extends StatelessWidget {
  final List<JainFestival> festivals;

  const FestivalsList({super.key, required this.festivals});

  @override
  Widget build(BuildContext context) {
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
