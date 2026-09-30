import 'package:flutter/material.dart';
import '../services/favorites_service.dart';
import '../services/data_repository.dart';
import '../models/content_item.dart';
import '../theme/app_theme.dart';
import '../widgets/space_background.dart';
import '../widgets/glass_card.dart';
import 'viewer_screen.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final favService = FavoritesService();

    return Scaffold(
      appBar: AppBar(
        title: const Text('पसंदीदा रचनाएँ (Bookmarks)'),
      ),
      body: SpaceBackground(
        child: ListenableBuilder(
          listenable: favService,
          builder: (context, _) {
            final favoriteIds = favService.favoriteIds.toList();

            if (favoriteIds.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.favorite_border_rounded, size: 56, color: AppTheme.textMuted),
                      SizedBox(height: 16),
                      Text(
                        'कोई पसंदीदा रचना नहीं है',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'किसी भी स्तोत्र या पूजा को पढ़ते समय दिल (♡) के आइकन पर टैप करके उसे यहाँ सहेजें।',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12, color: AppTheme.textMuted, height: 1.5),
                      ),
                    ],
                  ),
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              itemCount: favoriteIds.length,
              itemBuilder: (context, index) {
                final id = favoriteIds[index];
                return FutureBuilder<ContentDetail?>(
                  future: DataRepository().getContentById(id),
                  builder: (context, snapshot) {
                    final item = snapshot.data;
                    final title = item?.title ?? id;
                    final category = item?.category ?? 'stotra';

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10.0),
                      child: GlassCard(
                        padding: const EdgeInsets.all(14),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => ViewerScreen(
                                contentId: id,
                                contentTitle: title,
                                category: category,
                              ),
                            ),
                          );
                        },
                        child: Row(
                          children: [
                            const Icon(Icons.bookmark_rounded, color: AppTheme.goldLight, size: 22),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    title,
                                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    category.toUpperCase(),
                                    style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete_outline_rounded, color: AppTheme.textMuted, size: 20),
                              tooltip: 'हटाएं',
                              onPressed: () => favService.toggleFavorite(id),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            );
          },
        ),
      ),
    );
  }
}
