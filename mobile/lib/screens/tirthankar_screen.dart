import 'package:flutter/material.dart';
import '../services/data_repository.dart';
import '../models/tirthankar.dart';
import '../theme/app_theme.dart';
import '../widgets/space_background.dart';
import '../widgets/glass_card.dart';
import 'viewer_screen.dart';

class TirthankarScreen extends StatefulWidget {
  final String? initialTirthankarId;

  const TirthankarScreen({super.key, this.initialTirthankarId});

  @override
  State<TirthankarScreen> createState() => _TirthankarScreenState();
}

class _TirthankarScreenState extends State<TirthankarScreen> {
  @override
  void initState() {
    super.initState();
    if (widget.initialTirthankarId != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final repo = DataRepository();
        final t = repo.getTirthankarById(widget.initialTirthankarId!);
        if (t != null) {
          _showTirthankarDetails(t);
        }
      });
    }
  }

  void _showTirthankarDetails(Tirthankar t) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: const BoxDecoration(
            color: Color(0xF80B0E19),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            border: Border(
              top: BorderSide(color: AppTheme.gold, width: 1.5),
            ),
          ),
          child: Column(
            children: [
              // Top drag bar
              Container(
                width: 44,
                height: 4,
                margin: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  children: [
                    // Header
                    Center(
                      child: Column(
                        children: [
                          Text(t.symbolEmoji, style: const TextStyle(fontSize: 48)),
                          const SizedBox(height: 8),
                          Text(
                            t.nameHindi,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.goldLight,
                            ),
                          ),
                          if (t.subtitleHindi != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              t.subtitleHindi!,
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 13, color: AppTheme.textMuted),
                            ),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Quick Specs Grid
                    GlassCard(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        children: [
                          _buildDetailRow('चिह्न (लांछन):', t.symbol),
                          _buildDetailRow('वर्ण (शरीर का रंग):', t.color),
                          _buildDetailRow('पिता:', t.father),
                          _buildDetailRow('माता:', t.mother),
                          _buildDetailRow('जन्म भूमि:', t.birthPlace),
                          _buildDetailRow('निर्वाण क्षेत्र:', t.nirvanaPlace),
                          if (t.kevalgyanTree != null) _buildDetailRow('केवलज्ञान वृक्ष:', t.kevalgyanTree!),
                          if (t.mantra != null) _buildDetailRow('मूल मंत्र:', t.mantra!),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Panch Kalyanaks
                    if (t.kalyanak.janma != null) ...[
                      const Text(
                        'पाँच कल्याणक तिथियाँ',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
                      ),
                      const SizedBox(height: 10),
                      GlassCard(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          children: [
                            if (t.kalyanak.garbha != null) _buildDetailRow('गर्भ कल्याणक:', t.kalyanak.garbha!),
                            if (t.kalyanak.janma != null) _buildDetailRow('जन्म कल्याणक:', t.kalyanak.janma!),
                            if (t.kalyanak.tap != null) _buildDetailRow('तप (दीक्षा) कल्याणक:', t.kalyanak.tap!),
                            if (t.kalyanak.gyan != null) _buildDetailRow('ज्ञान कल्याणक:', t.kalyanak.gyan!),
                            if (t.kalyanak.moksha != null) _buildDetailRow('मोक्ष (निर्वाण) कल्याणक:', t.kalyanak.moksha!),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Bio / Overview
                    if (t.bioHindi != null && t.bioHindi!.isNotEmpty) ...[
                      const Text(
                        'संक्षिप्त जीवन परिचय',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
                      ),
                      const SizedBox(height: 10),
                      GlassCard(
                        padding: const EdgeInsets.all(16),
                        child: Text(
                          t.bioHindi!,
                          style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],

                    // Quick buttons to open Chalisa / Aarti
                    Row(
                      children: [
                        if (t.chalisaId != null)
                          Expanded(
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.gold,
                                foregroundColor: Colors.black,
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              icon: const Icon(Icons.menu_book_rounded, size: 18),
                              label: const Text('चालीसा पढ़ें', style: TextStyle(fontWeight: FontWeight.bold)),
                              onPressed: () {
                                Navigator.pop(ctx);
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => ViewerScreen(
                                      contentId: t.chalisaId!,
                                      contentTitle: '${t.nameHindi} चालीसा',
                                      category: 'chalisa',
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        if (t.chalisaId != null && t.artiId != null) const SizedBox(width: 12),
                        if (t.artiId != null)
                          Expanded(
                            child: OutlinedButton.icon(
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: AppTheme.gold),
                                foregroundColor: AppTheme.goldLight,
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              icon: const Icon(Icons.brightness_7_rounded, size: 18),
                              label: const Text('आरती पढ़ें', style: TextStyle(fontWeight: FontWeight.bold)),
                              onPressed: () {
                                Navigator.pop(ctx);
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => ViewerScreen(
                                      contentId: t.artiId!,
                                      contentTitle: '${t.nameHindi} आरती',
                                      category: 'arti',
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final repo = DataRepository();
    final tirthankaras = repo.getAllTirthankaras();

    return Scaffold(
      appBar: AppBar(
        title: const Text('२४ तीर्थंकर परिचय'),
      ),
      body: SpaceBackground(
        child: GridView.builder(
          padding: const EdgeInsets.all(14),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.35,
          ),
          itemCount: tirthankaras.length,
          itemBuilder: (context, index) {
            final t = tirthankaras[index];
            return GlassCard(
              padding: const EdgeInsets.all(12),
              onTap: () => _showTirthankarDetails(t),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTheme.gold.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '${t.number}',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
                        ),
                      ),
                      Text(t.symbolEmoji, style: const TextStyle(fontSize: 20)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    t.nameHindi.replaceAll('श्री ', '').replaceAll(' भगवान', ''),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                  ),
                  Text(
                    'चिह्न: ${t.symbol}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
