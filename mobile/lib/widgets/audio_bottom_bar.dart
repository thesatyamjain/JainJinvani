import 'package:flutter/material.dart';
import '../services/audio_service.dart';
import '../theme/app_theme.dart';

class AudioBottomBar extends StatelessWidget {
  const AudioBottomBar({super.key});

  String _formatDuration(Duration d) {
    final m = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: AppAudioService(),
      builder: (context, _) {
        final audio = AppAudioService();
        if (audio.currentContentId == null) {
          return const SizedBox.shrink();
        }

        final double progress = (audio.duration.inMilliseconds > 0)
            ? (audio.position.inMilliseconds / audio.duration.inMilliseconds).clamp(0.0, 1.0)
            : 0.0;

        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xF0111422),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.borderMedium, width: 1),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.4),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
              BoxShadow(
                color: AppTheme.gold.withValues(alpha: 0.1),
                blurRadius: 12,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Thin scrubber
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: LinearProgressIndicator(
                  value: progress,
                  minHeight: 3,
                  backgroundColor: Colors.white10,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.gold),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                child: Row(
                  children: [
                    // Icon / Vinyl
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: AppTheme.gold.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppTheme.borderSubtle),
                      ),
                      child: const Icon(
                        Icons.music_note_rounded,
                        color: AppTheme.goldLight,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Title and time
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            audio.currentTitle ?? 'ऑडियो पाठ',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${_formatDuration(audio.position)} / ${_formatDuration(audio.duration)}',
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppTheme.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Play/Pause
                    IconButton(
                      icon: Icon(
                        audio.isPlaying ? Icons.pause_circle_filled_rounded : Icons.play_circle_fill_rounded,
                        color: AppTheme.gold,
                        size: 32,
                      ),
                      onPressed: () {
                        if (audio.isPlaying) {
                          audio.pause();
                        } else {
                          audio.resume();
                        }
                      },
                    ),
                    // Close
                    IconButton(
                      icon: const Icon(
                        Icons.close_rounded,
                        color: AppTheme.textMuted,
                        size: 20,
                      ),
                      onPressed: () => audio.stop(),
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
