import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../services/data_repository.dart';
import '../services/audio_service.dart';
import '../services/favorites_service.dart';
import '../models/content_item.dart';
import '../theme/app_theme.dart';
import '../widgets/space_background.dart';
import '../widgets/glass_card.dart';
import '../widgets/verse_card.dart';
import '../widgets/audio_bottom_bar.dart';

class ViewerScreen extends StatefulWidget {
  final String contentId;
  final String contentTitle;
  final String? category;

  const ViewerScreen({
    super.key,
    required this.contentId,
    required this.contentTitle,
    this.category,
  });

  @override
  State<ViewerScreen> createState() => _ViewerScreenState();
}

class _ViewerScreenState extends State<ViewerScreen> {
  ContentDetail? _content;
  bool _isLoading = true;
  double _fontSize = 18.0;

  @override
  void initState() {
    super.initState();
    _loadContent();
  }

  Future<void> _loadContent() async {
    final repo = DataRepository();
    final data = await repo.getContentById(widget.contentId);
    if (mounted) {
      setState(() {
        _content = data;
        _isLoading = false;
      });
    }
  }

  void _shareContent() {
    if (_content == null) return;
    final buffer = StringBuffer();
    buffer.writeln('॥ ${_content!.title} ॥');
    if (_content!.subtitle != null) buffer.writeln(_content!.subtitle);
    buffer.writeln();

    if (_content!.verses.isNotEmpty) {
      for (final v in _content!.verses.take(3)) {
        buffer.writeln(v.displayOriginalLines.join('\n'));
        buffer.writeln(v.displayTranslationLines.join('\n'));
        buffer.writeln();
      }
    } else if (_content!.lyrics.isNotEmpty) {
      buffer.writeln(_content!.lyrics.take(8).join('\n'));
    }

    buffer.writeln('\nसम्पूर्ण पाठ जैन जिनवाणी मोबाइल ऍप पर पढ़ें 卐');
    // ignore: deprecated_member_use
    Share.share(buffer.toString());
  }

  @override
  Widget build(BuildContext context) {
    final favService = FavoritesService();
    final hasAudio = AppAudioService.hasAudioTrack(widget.contentId);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.contentTitle),
        actions: [
          // Font size adjusters
          IconButton(
            icon: const Icon(Icons.remove_rounded, size: 20),
            tooltip: 'फॉन्ट छोटा करें',
            onPressed: () {
              if (_fontSize > 14) setState(() => _fontSize -= 1.5);
            },
          ),
          IconButton(
            icon: const Icon(Icons.add_rounded, size: 20),
            tooltip: 'फॉन्ट बड़ा करें',
            onPressed: () {
              if (_fontSize < 28) setState(() => _fontSize += 1.5);
            },
          ),
          // Favorite toggle
          ListenableBuilder(
            listenable: favService,
            builder: (context, _) {
              final isFav = favService.isFavorite(widget.contentId);
              return IconButton(
                icon: Icon(
                  isFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                  color: isFav ? Colors.redAccent : AppTheme.goldLight,
                ),
                tooltip: isFav ? 'पसंदीदा से हटाएं' : 'पसंदीदा में जोड़ें',
                onPressed: () => favService.toggleFavorite(widget.contentId),
              );
            },
          ),
          // Share
          IconButton(
            icon: const Icon(Icons.share_rounded, size: 20, color: AppTheme.goldLight),
            tooltip: 'शेयर करें',
            onPressed: _shareContent,
          ),
        ],
      ),
      bottomNavigationBar: const AudioBottomBar(),
      body: SpaceBackground(
        child: _isLoading
            ? const Center(
                child: CircularProgressIndicator(color: AppTheme.gold),
              )
            : _content == null
                ? _buildNotFoundView()
                : _buildContentView(hasAudio),
      ),
    );
  }

  Widget _buildNotFoundView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.auto_stories_outlined, size: 48, color: AppTheme.textMuted),
          const SizedBox(height: 12),
          Text(
            'रचना लोड नहीं हो सकी: ${widget.contentTitle}',
            style: const TextStyle(fontSize: 14, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.gold),
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('वापस जाएं', style: TextStyle(color: Colors.black)),
          ),
        ],
      ),
    );
  }

  Widget _buildContentView(bool hasAudio) {
    final c = _content!;

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      children: [
        // 1. Header Banner
        GlassCard(
          padding: const EdgeInsets.all(18),
          borderColor: AppTheme.borderMedium,
          child: Column(
            children: [
              Text(
                '॥ ${c.title} ॥',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.goldLight,
                  height: 1.3,
                ),
              ),
              if (c.subtitle != null && c.subtitle!.isNotEmpty) ...[
                const SizedBox(height: 6),
                Text(
                  c.subtitle!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                ),
              ],
              if (c.author != null && c.author!.isNotEmpty) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceElevated,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.borderSubtle),
                  ),
                  child: Text(
                    'रचनाकार: ${c.author}',
                    style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                  ),
                ),
              ],
              if (c.meaning != null && c.meaning!.isNotEmpty) ...[
                const SizedBox(height: 12),
                Text(
                  c.meaning!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 13,
                    fontStyle: FontStyle.italic,
                    color: AppTheme.textSecondary,
                    height: 1.5,
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // 2. Audio Play Banner (if audio available)
        if (hasAudio) ...[
          _buildAudioBanner(c),
          const SizedBox(height: 16),
        ],

        // 3. Render Verses (if available)
        if (c.verses.isNotEmpty) ...[
          for (int i = 0; i < c.verses.length; i++)
            VerseCard(
              verse: c.verses[i],
              index: i,
              fontSize: _fontSize,
            ),
        ],

        // 4. Render Chapters (if available)
        if (c.chapters.isNotEmpty) ...[
          for (final ch in c.chapters)
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: GlassCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      ch.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.goldLight,
                      ),
                    ),
                    const SizedBox(height: 10),
                    for (final line in ch.content)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8.0),
                        child: Text(
                          line,
                          style: TextStyle(fontSize: _fontSize - 2, color: AppTheme.textSecondary, height: 1.6),
                        ),
                      ),
                  ],
                ),
              ),
            ),
        ],

        // 5. Render Lyrics (if available)
        if (c.lyrics.isNotEmpty) ...[
          GlassCard(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                for (final line in c.lyrics)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 6.0),
                    child: Text(
                      line,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: _fontSize,
                        fontWeight: FontWeight.w500,
                        color: line.startsWith('॥') || line.endsWith('॥')
                            ? AppTheme.goldLight
                            : AppTheme.textSecondary,
                        height: 1.6,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],

        // 6. Render HTML / Raw Content
        if (c.htmlContent != null && c.htmlContent!.isNotEmpty) ...[
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Text(
              _cleanHtml(c.htmlContent!),
              style: TextStyle(fontSize: _fontSize - 2, color: AppTheme.textSecondary, height: 1.7),
            ),
          ),
        ],

        // Closing blessing banner
        const SizedBox(height: 24),
        const Center(
          child: Column(
            children: [
              Text('卐', style: TextStyle(fontSize: 28, color: AppTheme.goldLight)),
              SizedBox(height: 4),
              Text(
                '॥ जय जिनेंद्र • जिनवाणी माता की जय ॥',
                style: TextStyle(fontSize: 13, color: AppTheme.textMuted, letterSpacing: 0.5),
              ),
              SizedBox(height: 32),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAudioBanner(ContentDetail c) {
    return ListenableBuilder(
      listenable: AppAudioService(),
      builder: (context, _) {
        final audio = AppAudioService();
        final isThisPlaying = audio.isPlaying && audio.currentContentId == widget.contentId;

        return GlassCard(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          glow: isThisPlaying,
          borderColor: isThisPlaying ? AppTheme.gold : AppTheme.borderSubtle,
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppTheme.gold.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isThisPlaying ? Icons.volume_up_rounded : Icons.headphones_rounded,
                  color: AppTheme.goldLight,
                  size: 22,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isThisPlaying ? 'ऑडियो पाठ बज रहा है' : 'ऑडियो पाठ उपलब्ध है',
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                    ),
                    const Text(
                      'शुद्ध उच्चारण सहित श्रवण करें',
                      style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                    ),
                  ],
                ),
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                icon: Icon(isThisPlaying ? Icons.pause_rounded : Icons.play_arrow_rounded, size: 20),
                label: Text(isThisPlaying ? 'रोकें' : 'सुनें', style: const TextStyle(fontWeight: FontWeight.bold)),
                onPressed: () {
                  audio.playContentAudio(widget.contentId, c.title);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  String _cleanHtml(String html) {
    return html
        .replaceAll(RegExp(r'<[^>]*>'), '')
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"');
  }
}
