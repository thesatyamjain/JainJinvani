import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import '../models/content_item.dart';
import '../theme/app_theme.dart';
import 'glass_card.dart';

class VerseCard extends StatelessWidget {
  final Verse verse;
  final int index;
  final double fontSize;

  const VerseCard({
    super.key,
    required this.verse,
    required this.index,
    this.fontSize = 18.0,
  });

  void _copyToClipboard(BuildContext context) {
    final buffer = StringBuffer();
    if (verse.displayOriginalLines.isNotEmpty) {
      buffer.writeln(verse.displayOriginalLines.join('\n'));
      buffer.writeln();
    }
    if (verse.displayTranslationLines.isNotEmpty) {
      buffer.writeln('भावार्थ:');
      buffer.writeln(verse.displayTranslationLines.join('\n'));
    }

    Clipboard.setData(ClipboardData(text: buffer.toString()));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('पद्य कॉपी हो गया!'),
        duration: Duration(seconds: 2),
        backgroundColor: AppTheme.surfaceElevated,
      ),
    );
  }

  void _shareVerse() {
    final buffer = StringBuffer();
    if (verse.displayOriginalLines.isNotEmpty) {
      buffer.writeln(verse.displayOriginalLines.join('\n'));
      buffer.writeln();
    }
    if (verse.displayTranslationLines.isNotEmpty) {
      buffer.writeln('भावार्थ:');
      buffer.writeln(verse.displayTranslationLines.join('\n'));
    }
    buffer.writeln('\n— जैन जिनवाणी 卐');
    // ignore: deprecated_member_use
    Share.share(buffer.toString());
  }

  @override
  Widget build(BuildContext context) {
    final originalLines = verse.displayOriginalLines;
    final translationLines = verse.displayTranslationLines;
    final verseNum = verse.number ?? '${index + 1}';

    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: GlassCard(
        padding: const EdgeInsets.all(18),
        borderColor: AppTheme.borderSubtle,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header: Verse badge & Copy/Share actions
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
                  ),
                  child: Text(
                    '॥ पद्य $verseNum ॥',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.goldLight,
                    ),
                  ),
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.copy_rounded, size: 18, color: AppTheme.textMuted),
                      tooltip: 'कॉपी करें',
                      onPressed: () => _copyToClipboard(context),
                      visualDensity: VisualDensity.compact,
                    ),
                    IconButton(
                      icon: const Icon(Icons.share_rounded, size: 18, color: AppTheme.textMuted),
                      tooltip: 'शेयर करें',
                      onPressed: _shareVerse,
                      visualDensity: VisualDensity.compact,
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Sanskrit / Prakrit Original Text
            if (originalLines.isNotEmpty) ...[
              Container(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                decoration: BoxDecoration(
                  color: Colors.black26,
                  borderRadius: BorderRadius.circular(10),
                  border: const Border(
                    left: BorderSide(color: AppTheme.gold, width: 3),
                  ),
                ),
                child: Text(
                  originalLines.join('\n'),
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: fontSize,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.goldLight,
                    height: 1.6,
                    letterSpacing: 0.2,
                  ),
                ),
              ),
              const SizedBox(height: 14),
            ],

            // Hindi Translation / भावार्थ
            if (translationLines.isNotEmpty) ...[
              Row(
                children: [
                  const Icon(Icons.translate_rounded, size: 14, color: AppTheme.textMuted),
                  const SizedBox(width: 6),
                  Text(
                    'सरल भावार्थ',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.gold.withValues(alpha: 0.8),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                translationLines.join('\n'),
                style: TextStyle(
                  fontSize: fontSize - 2,
                  color: AppTheme.textSecondary,
                  height: 1.6,
                ),
              ),
            ],

            // Explanation if available
            if (verse.explanation != null && verse.explanation!.isNotEmpty) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0x221E293B),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  verse.explanation!,
                  style: const TextStyle(
                    fontSize: 13,
                    fontStyle: FontStyle.italic,
                    color: AppTheme.textMuted,
                    height: 1.5,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
