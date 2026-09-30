import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';
import 'favorites_screen.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          const Text(
            'अधिक विकल्प व जानकारी',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'जैन जिनवाणी ऍप सेटिंग, ऑफ़लाइन संग्रह व संदर्भ',
            style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 20),

          // 1. Favorites Quick Tile
          GlassCard(
            padding: const EdgeInsets.all(16),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const FavoritesScreen()),
              );
            },
            child: const Row(
              children: [
                Icon(Icons.bookmark_added_rounded, color: AppTheme.goldLight, size: 24),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'पसंदीदा रचना संग्रह',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'आपके द्वारा बुकमार्क किए गए स्तोत्र व पूजा',
                        style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textMuted),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // 2. Offline Status Banner
          GlassCard(
            padding: const EdgeInsets.all(16),
            borderColor: AppTheme.gold.withValues(alpha: 0.3),
            child: const Row(
              children: [
                Icon(Icons.offline_pin_rounded, color: Colors.greenAccent, size: 24),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '१००% ऑफ़लाइन मंदिर स्वाध्याय',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'समस्त १,०००+ रचनाएँ एवं ऑडियो बिना इंटरनेट के भी सुरक्षित रूप से उपलब्ध हैं।',
                        style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 3. Authenticity & Data Standard Info
          const Text(
            'प्रामाणिकता एवं आगम नियम',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
          ),
          const SizedBox(height: 10),
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  '॥ शत-प्रतिशत सम्पूर्ण रचना नियम ॥',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
                ),
                SizedBox(height: 8),
                Text(
                  'दिगम्बर जैन आगम अनुसार किसी भी रचना में अधूरा पाठ या संक्षेप (Summary) नहीं दिया गया है। प्रत्येक अष्टक में पूरे ९ पद्य, चालीसा में ४० चौपाइयाँ एवं पूजा में सम्पूर्ण अष्टद्रव्य क्रम व जयमाला समाहित हैं।',
                  style: TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.6),
                ),
                SizedBox(height: 12),
                Text(
                  'प्रामाणिक संदर्भ स्रोत:\n• श्री गणेशप्रसाद वर्णी जैन ग्रंथमाला\n• परमश्रुत प्रभावक मंडल (अगास)\n• पं. टोडरमल स्मारक ट्रस्ट (जयपुर)\n• भारतीय ज्ञानपीठ ग्रंथावली',
                  style: TextStyle(fontSize: 11, color: AppTheme.textMuted, height: 1.5),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 4. App Actions
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.share_rounded, color: AppTheme.goldLight),
                  title: const Text('जैन जिनवाणी ऍप साझा करें', style: TextStyle(fontSize: 14, color: AppTheme.textPrimary)),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textMuted),
                  onTap: () {
                    // ignore: deprecated_member_use
                    Share.share('जैन जिनवाणी — सम्पूर्ण दिगम्बर जैन आगम, भक्तामर, पूजा, आरती एवं १०८ जाप माला ऍप।\nhttps://jainjinvani.pages.dev');
                  },
                ),
                const Divider(color: AppTheme.borderSubtle, height: 1),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.info_outline_rounded, color: AppTheme.goldLight),
                  title: const Text('ऍप संस्करण', style: TextStyle(fontSize: 14, color: AppTheme.textPrimary)),
                  trailing: const Text('v1.0.0 (Native)', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Footer
          const Center(
            child: Column(
              children: [
                Text('卐', style: TextStyle(fontSize: 28, color: AppTheme.goldLight)),
                SizedBox(height: 4),
                Text(
                  'जैन जिनवाणी • जिनधर्मो विजयते',
                  style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                ),
                SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
