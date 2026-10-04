import 'package:flutter/material.dart';
import '../services/data_repository.dart';
import '../models/content_item.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';
import 'category_screen.dart';
import 'viewer_screen.dart';

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<InventoryItem> _searchResults = [];
  bool _isSearching = false;

  final List<Map<String, String>> _categories = const [
    {
      'id': 'puja',
      'title': 'पूजा एवं विधान',
      'subtitle': 'नित्य पूजा, तीर्थंकर पूजा, दशलक्षण, सिद्धचक्र एवं शांति विधान',
      'count': '२२८+',
      'icon': '🛕',
    },
    {
      'id': 'stotra',
      'title': 'स्तोत्र संग्रह',
      'subtitle': 'भक्तामर, कल्याणमंदिर, एकीभाव, विषापहार एवं स्वयंभू स्तोत्र',
      'count': '३९+',
      'icon': '📜',
    },
    {
      'id': 'chalisa',
      'title': 'चालीसा संग्रह',
      'subtitle': 'आदिनाथ, पारस, महावीर, शांतिनाथ एवं २४ तीर्थंकर चालीसा',
      'count': '३८+',
      'icon': '📖',
    },
    {
      'id': 'arti',
      'title': 'आरती संग्रह',
      'subtitle': 'पंचपरमेष्ठी, २४ तीर्थंकर, पद्मावती माता एवं मंगल दीप आरती',
      'count': '३३+',
      'icon': '🪔',
    },
    {
      'id': 'bhajan',
      'title': 'भजन एवं भक्ति',
      'subtitle': 'पारंपरिक जैन पद, वैराग्य रस एवं भक्ति संगीत',
      'count': '४६+',
      'icon': '🎵',
    },
    {
      'id': 'shastra',
      'title': 'शास्त्र एवं सिद्धांत',
      'subtitle': 'तत्त्वार्थ सूत्र, छहढाला, समयसार, द्रव्यसंग्रह, इष्टोपदेश',
      'count': '४२+',
      'icon': '📚',
    },
    {
      'id': 'path',
      'title': 'नित्य पाठ व स्तुति',
      'subtitle': 'समाधितंत्र, आलोचना पाठ, मेरी भावना, बारह भावना, स्वस्तिवाचन',
      'count': '४८+',
      'icon': '🙏',
    },
    {
      'id': 'vrat',
      'title': 'व्रत एवं कथाएँ',
      'subtitle': 'रोहिणी, सुगंध दशमी, अनंत चतुर्दशी, दशलक्षण पर्व व्रत विधि',
      'count': '१७४+',
      'icon': '🕯️',
    },
    {
      'id': 'tattva',
      'title': 'जैन तत्वज्ञान',
      'subtitle': 'जीव-अजीव, सात तत्व, छह द्रव्य, कर्म सिद्धांत एवं गुणस्थान',
      'count': '१३+',
      'icon': '💡',
    },
    {
      'id': 'itihas',
      'title': 'जैन इतिहास व भूगोल',
      'subtitle': 'प्राचीन तीर्थ, आचार्य परंपरा, तीन लोक एवं समवशरण रचना',
      'count': '१४+',
      'icon': '🗺️',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String query) {
    if (query.trim().isEmpty) {
      setState(() {
        _isSearching = false;
        _searchResults = [];
      });
      return;
    }

    final repo = DataRepository();
    final results = repo.search(query);
    setState(() {
      _isSearching = true;
      _searchResults = results;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          const Text(
            'जिनवाणी ग्रंथालय',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            '१०००+ प्रामाणिक आगम, स्तोत्र, चालीसा, पूजन एवं शास्त्र संग्रह',
            style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 16),

          // Universal Search Bar
          TextField(
            controller: _searchController,
            onChanged: _onSearch,
            style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
            decoration: InputDecoration(
              hintText: 'किसी भी स्तोत्र, पूजा, ग्रंथ का नाम लिखें...',
              hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
              prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.goldLight, size: 20),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear_rounded, color: AppTheme.textMuted, size: 18),
                      onPressed: () {
                        _searchController.clear();
                        _onSearch('');
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
          const SizedBox(height: 16),

          // Search results or Category list
          if (_isSearching) ...[
            Text(
              'खोज परिणाम: ${_searchResults.length} रचनाएँ',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
            ),
            const SizedBox(height: 12),
            _buildSearchResults(),
          ] else ...[
            const Text(
              'सभी अनुयोग एवं श्रेणियाँ',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.goldLight),
            ),
            const SizedBox(height: 12),
            _buildCategoryCards(),
          ],
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    if (_searchResults.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Column(
            children: [
              Icon(Icons.search_off_rounded, size: 48, color: AppTheme.textMuted),
              SizedBox(height: 12),
              Text(
                'कोई परिणाम नहीं मिला। कृपया भिन्न शब्द लिखकर खोजें।',
                style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return Column(
      children: _searchResults.map((item) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 8.0),
          child: GlassCard(
            padding: const EdgeInsets.all(12),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => ViewerScreen(
                    contentId: item.id,
                    contentTitle: item.title,
                    category: item.category,
                  ),
                ),
              );
            },
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Center(
                    child: Icon(Icons.auto_stories_rounded, size: 18, color: AppTheme.goldLight),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.title,
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      if (item.description != null && item.description!.isNotEmpty) ...[
                        const SizedBox(height: 2),
                        Text(
                          item.description!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                        ),
                      ],
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

  Widget _buildCategoryCards() {
    return Column(
      children: _categories.map((cat) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 12.0),
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => CategoryScreen(
                    categoryId: cat['id']!,
                    categoryTitle: cat['title']!,
                  ),
                ),
              );
            },
            child: Row(
              children: [
                Text(cat['icon']!, style: const TextStyle(fontSize: 28)),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            cat['title']!,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.gold.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              cat['count']!,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.goldLight,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        cat['subtitle']!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 11, color: AppTheme.textMuted, height: 1.4),
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
