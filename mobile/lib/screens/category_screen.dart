import 'package:flutter/material.dart';
import '../services/data_repository.dart';
import '../services/audio_service.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';
import '../widgets/space_background.dart';
import '../widgets/audio_bottom_bar.dart';
import 'viewer_screen.dart';

class CategoryScreen extends StatefulWidget {
  final String categoryId;
  final String categoryTitle;

  const CategoryScreen({
    super.key,
    required this.categoryId,
    required this.categoryTitle,
  });

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedSubCategory = 'all';
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final repo = DataRepository();
    final allItems = repo.getItemsByCategory(widget.categoryId);
    final subCategories = repo.getSubCategories(widget.categoryId);

    // Filter by subcategory and search query
    final filteredItems = allItems.where((item) {
      if (_selectedSubCategory != 'all' && item.subCategory != _selectedSubCategory) {
        return false;
      }
      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final matchTitle = item.title.toLowerCase().contains(q);
        final matchDesc = item.description != null && item.description!.toLowerCase().contains(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.categoryTitle),
      ),
      bottomNavigationBar: const AudioBottomBar(),
      body: SpaceBackground(
        child: Column(
          children: [
            // 1. Search Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: TextField(
                controller: _searchController,
                onChanged: (val) => setState(() => _searchQuery = val.trim()),
                style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                decoration: InputDecoration(
                  hintText: '${widget.categoryTitle} में खोजें...',
                  hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.goldLight, size: 20),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear_rounded, color: AppTheme.textMuted, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            setState(() => _searchQuery = '');
                          },
                        )
                      : null,
                  filled: true,
                  fillColor: AppTheme.surfaceElevated,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.borderSubtle),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.borderSubtle),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.gold, width: 1.5),
                  ),
                ),
              ),
            ),

            // 2. Subcategory Filter Chips
            if (subCategories.isNotEmpty)
              SizedBox(
                height: 42,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: subCategories.length,
                  itemBuilder: (context, index) {
                    final sub = subCategories[index];
                    final isSelected = _selectedSubCategory == sub.id;

                    return Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: FilterChip(
                        selected: isSelected,
                        label: Text(sub.label),
                        labelStyle: TextStyle(
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          color: isSelected ? Colors.black : AppTheme.textSecondary,
                        ),
                        backgroundColor: AppTheme.surfaceElevated,
                        selectedColor: AppTheme.gold,
                        checkmarkColor: Colors.black,
                        side: BorderSide(
                          color: isSelected ? AppTheme.gold : AppTheme.borderSubtle,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        onSelected: (selected) {
                          setState(() {
                            _selectedSubCategory = selected ? sub.id : 'all';
                          });
                        },
                      ),
                    );
                  },
                ),
              ),

            const SizedBox(height: 8),

            // Item count indicator
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'कुल रचनाएँ: ${filteredItems.length}',
                    style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  if (_selectedSubCategory != 'all' || _searchQuery.isNotEmpty)
                    InkWell(
                      onTap: () {
                        _searchController.clear();
                        setState(() {
                          _selectedSubCategory = 'all';
                          _searchQuery = '';
                        });
                      },
                      child: const Text('फ़िल्टर हटाएं', style: TextStyle(fontSize: 11, color: AppTheme.goldLight)),
                    ),
                ],
              ),
            ),

            // 3. Grid of Content Items (Strict 2-Column Standard)
            Expanded(
              child: filteredItems.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.menu_book_outlined, size: 48, color: AppTheme.textMuted),
                          const SizedBox(height: 12),
                          Text(
                            _searchQuery.isNotEmpty
                                ? 'कोई रचना नहीं मिली'
                                : 'इस श्रेणी में अभी रचना उपलब्ध नहीं है',
                            style: const TextStyle(fontSize: 14, color: AppTheme.textMuted),
                          ),
                        ],
                      ),
                    )
                  : GridView.builder(
                      padding: const EdgeInsets.all(14),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 10,
                        mainAxisSpacing: 10,
                        childAspectRatio: 1.35,
                      ),
                      itemCount: filteredItems.length,
                      itemBuilder: (context, index) {
                        final item = filteredItems[index];
                        final hasAudio = AppAudioService.hasAudioTrack(item.id) || (item.audioUrl != null && item.audioUrl!.isNotEmpty);

                        return GlassCard(
                          padding: const EdgeInsets.all(12),
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => ViewerScreen(
                                  contentId: item.id,
                                  contentTitle: item.title,
                                  category: widget.categoryId,
                                ),
                              ),
                            );
                          },
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  // Order or scripture emblem
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: AppTheme.gold.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      '${index + 1}',
                                      style: const TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.goldLight,
                                      ),
                                    ),
                                  ),
                                  if (hasAudio)
                                    Container(
                                      padding: const EdgeInsets.all(3),
                                      decoration: BoxDecoration(
                                        color: AppTheme.gold.withValues(alpha: 0.2),
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(
                                        Icons.headphones_rounded,
                                        size: 14,
                                        color: AppTheme.goldLight,
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                item.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.textPrimary,
                                  height: 1.3,
                                ),
                              ),
                              Text(
                                item.description ?? item.author ?? 'पारंपरिक पाठ',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 10,
                                  color: AppTheme.textMuted,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
