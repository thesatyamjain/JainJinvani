import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';
import 'jap_mala_screen.dart';
import 'samayik_screen.dart';
import 'niyam_screen.dart';
import 'panchang_screen.dart';
import 'viewer_screen.dart';

class SadhanaScreen extends StatelessWidget {
  const SadhanaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          const Text(
            'नित्य साधना व स्वाध्याय',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'आत्म-शुद्धि, समता, नियम एवं दैनिक आराधना केंद्र',
            style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 20),

          // Core Sadhana Features (2-column layout)
          const Text(
            'प्रमुख साधना अंग',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
          ),
          const SizedBox(height: 12),
          _buildCoreSadhanaGrid(context),
          const SizedBox(height: 28),

          // Daily Ritual & Recitation Flow
          const Text(
            'दैनिक मंदिर व घर पूजा क्रम',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
          ),
          const SizedBox(height: 12),
          _buildDailyRitualFlow(context),
          const SizedBox(height: 28),

          // Chintan & Swadhyay
          const Text(
            'वैराग्य एवं आत्म-चिंतन',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
          ),
          const SizedBox(height: 12),
          _buildChintanList(context),
        ],
      ),
    );
  }

  Widget _buildCoreSadhanaGrid(BuildContext context) {
    final items = [
      {
        'title': '१०८ जाप माला',
        'subtitle': 'णमोकार व नवकार डिजिटल मनका जाप',
        'icon': '📿',
        'page': const JapMalaScreen(),
      },
      {
        'title': 'सामायिक साधना',
        'subtitle': '४८ मिनट समता ध्यान एवं इर्यावही पाठ',
        'icon': '🧘',
        'page': const SamayikScreen(),
      },
      {
        'title': 'दैनिक नियम',
        'subtitle': 'श्रावक के ८ मूल आचार संकल्प',
        'icon': '📋',
        'page': const NiyamaScreen(),
      },
      {
        'title': 'जैन पंचांग',
        'subtitle': 'दैनिक तिथि, पक्ष, संवत् एवं पर्व निर्णय',
        'icon': '🗓️',
        'page': const PanchangScreen(),
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.45,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final it = items[index];
        return GlassCard(
          padding: const EdgeInsets.all(14),
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => it['page'] as Widget),
            );
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(it['icon'] as String, style: const TextStyle(fontSize: 26)),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    it['title'] as String,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    it['subtitle'] as String,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDailyRitualFlow(BuildContext context) {
    final rituals = [
      {
        'id': 'abhishek-vidhi',
        'title': 'अभिषेक एवं शांतिधारा पाठ',
        'desc': 'प्रातः जिनेंद्र अभिषेक, गंधोदक एवं शांतिधारा विधि',
        'icon': '🚿',
        'category': 'vidhi',
      },
      {
        'id': 'dev-shastra-guru-puja',
        'title': 'देव शास्त्र गुरु पूजा',
        'desc': 'अष्टद्रव्य पूजन, स्थापना एवं जयमाला',
        'icon': '🌸',
        'category': 'puja',
      },
      {
        'id': 'chaubis-tirthankar-puja',
        'title': 'चौबीस तीर्थंकर पूजा',
        'desc': 'भगवान ऋषभदेव से महावीर स्वामी तक पावन अर्घ्य',
        'icon': '✨',
        'category': 'puja',
      },
      {
        'id': 'jain-aarti',
        'title': 'जैन मंगल दीप आरती',
        'desc': 'मंगल दीपक लाय के हम करते है तेरी आरती',
        'icon': '🪔',
        'category': 'arti',
      },
    ];

    return Column(
      children: rituals.map((r) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 10.0),
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => ViewerScreen(
                    contentId: r['id']!,
                    contentTitle: r['title']!,
                    category: r['category']!,
                  ),
                ),
              );
            },
            child: Row(
              children: [
                Text(r['icon']!, style: const TextStyle(fontSize: 24)),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        r['title']!,
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        r['desc']!,
                        style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textMuted),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildChintanList(BuildContext context) {
    final chintans = [
      {
        'id': 'alochana-path',
        'title': 'आलोचना पाठ',
        'desc': 'दैनिक भूलों एवं प्रमाद का प्रायश्चित पाठ',
        'category': 'path',
      },
      {
        'id': 'barah-bhavna',
        'title': 'बारह भावना (वैराग्य भावना)',
        'desc': 'अनित्य, अशरण, संसार, एकत्व आदि १२ भावनाओं का चिंतन',
        'category': 'path',
      },
      {
        'id': 'samadhi-maran-path',
        'title': 'समाधिमरण पाठ',
        'desc': 'सल्लेखना एवं शांतिपूर्ण मृत्यु का मंगल संकल्प',
        'category': 'path',
      },
    ];

    return Column(
      children: chintans.map((c) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 10.0),
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => ViewerScreen(
                    contentId: c['id']!,
                    contentTitle: c['title']!,
                    category: c['category']!,
                  ),
                ),
              );
            },
            child: Row(
              children: [
                const Icon(Icons.menu_book_rounded, color: AppTheme.goldLight, size: 20),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        c['title']!,
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        c['desc']!,
                        style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textMuted),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
