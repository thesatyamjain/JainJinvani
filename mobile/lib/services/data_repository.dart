import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import '../models/content_item.dart';
import '../models/tirthankar.dart';
import '../models/festival.dart';

class DataRepository {
  static final DataRepository _instance = DataRepository._internal();
  factory DataRepository() => _instance;
  DataRepository._internal();

  Map<String, String> _manifest = {};
  Map<String, List<InventoryItem>> _inventory = {};
  Map<String, List<SubCategoryDef>> _subCategories = {};
  final Map<String, Map<String, dynamic>> _moduleCache = {};
  List<Tirthankar> _tirthankaras = [];
  List<JainFestival> _festivals = [];

  bool _initialized = false;
  String? _initError;
  bool get isInitialized => _initialized;
  String? get initError => _initError;

  Future<void> init() async {
    if (_initialized) return;

    try {
      // 1. Load manifest
      final manifestStr = await rootBundle.loadString('assets/data/content_manifest.json');
      _manifest = Map<String, String>.from(json.decode(manifestStr) as Map);

      // 2. Load inventory
      final invStr = await rootBundle.loadString('assets/data/inventory.json');
      final invJson = json.decode(invStr) as Map<String, dynamic>;

      if (invJson['contentInventory'] is Map) {
        final invMap = invJson['contentInventory'] as Map<String, dynamic>;
        _inventory = invMap.map((key, value) {
          final items = (value as List)
              .map((e) => InventoryItem.fromJson(Map<String, dynamic>.from(e)))
              .toList();
          return MapEntry(key, items);
        });
      }

      if (invJson['subCategoryMap'] is Map) {
        final subMap = invJson['subCategoryMap'] as Map<String, dynamic>;
        _subCategories = subMap.map((key, value) {
          final subs = (value as List)
              .map((e) => SubCategoryDef.fromJson(Map<String, dynamic>.from(e)))
              .toList();
          return MapEntry(key, subs);
        });
      }

      // 3. Load tirthankaras
      final tStr = await rootBundle.loadString('assets/data/tirthankaras.json');
      final tList = json.decode(tStr) as List;
      _tirthankaras = tList.map((e) => Tirthankar.fromJson(Map<String, dynamic>.from(e))).toList();

      // 4. Load festivals
      final fStr = await rootBundle.loadString('assets/data/festivals.json');
      final fList = json.decode(fStr) as List;
      _festivals = fList.map((e) => JainFestival.fromJson(Map<String, dynamic>.from(e))).toList();

      _initialized = true;
      _initError = null;
    } catch (e, stack) {
      _initError = e.toString();
      debugPrint('[DataRepository] Initialization error: $e');
      debugPrint('[DataRepository] Stack: $stack');
    }
  }

  // Load a content module JSON (e.g. puja.json, stotra.json) with caching
  Future<Map<String, dynamic>> _loadModule(String moduleName) async {
    if (_moduleCache.containsKey(moduleName)) {
      return _moduleCache[moduleName]!;
    }
    try {
      final jsonStr = await rootBundle.loadString('assets/data/$moduleName.json');
      final data = json.decode(jsonStr) as Map<String, dynamic>;
      _moduleCache[moduleName] = data;
      return data;
    } catch (e) {
      debugPrint('[DataRepository] Failed to load module $moduleName: $e');
      return {};
    }
  }

  // Fetch full content item by id
  Future<ContentDetail?> getContentById(String id) async {
    await init();

    final moduleName = _manifest[id];
    if (moduleName == null) {
      // Fallback search across loaded modules
      for (final mod in _moduleCache.values) {
        if (mod.containsKey(id)) {
          return ContentDetail.fromJson(Map<String, dynamic>.from(mod[id]));
        }
      }
      return null;
    }

    final mod = await _loadModule(moduleName);
    if (mod.containsKey(id)) {
      return ContentDetail.fromJson(Map<String, dynamic>.from(mod[id]));
    }
    return null;
  }

  // Get items in category
  List<InventoryItem> getItemsByCategory(String category) {
    return _inventory[category] ?? [];
  }

  // Get subcategories for a category
  List<SubCategoryDef> getSubCategories(String category) {
    return _subCategories[category] ?? [];
  }

  // Search items across all categories
  List<InventoryItem> search(String query) {
    if (query.trim().isEmpty) return [];
    final q = query.trim().toLowerCase();
    final results = <InventoryItem>[];

    for (final list in _inventory.values) {
      for (final item in list) {
        if (item.title.toLowerCase().contains(q) ||
            (item.description != null && item.description!.toLowerCase().contains(q)) ||
            (item.author != null && item.author!.toLowerCase().contains(q))) {
          results.add(item);
        }
      }
    }
    return results;
  }

  // Tirthankaras
  List<Tirthankar> getAllTirthankaras() {
    return _tirthankaras;
  }

  Tirthankar? getTirthankarById(String id) {
    try {
      return _tirthankaras.firstWhere((t) => t.id == id);
    } catch (_) {
      return null;
    }
  }

  // Festivals
  List<JainFestival> getFestivals() {
    return _festivals;
  }
}
