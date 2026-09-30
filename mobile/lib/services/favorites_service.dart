import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FavoritesService extends ChangeNotifier {
  static final FavoritesService _instance = FavoritesService._internal();
  factory FavoritesService() => _instance;
  FavoritesService._internal();

  static const String _key = 'jain_jinvani_favorites';
  Set<String> _favoriteIds = {};
  bool _loaded = false;

  Set<String> get favoriteIds => _favoriteIds;

  Future<void> init() async {
    if (_loaded) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList(_key) ?? [];
      _favoriteIds = list.toSet();
      _loaded = true;
      notifyListeners();
    } catch (_) {}
  }

  bool isFavorite(String id) {
    return _favoriteIds.contains(id);
  }

  Future<void> toggleFavorite(String id) async {
    if (_favoriteIds.contains(id)) {
      _favoriteIds.remove(id);
    } else {
      _favoriteIds.add(id);
    }
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_key, _favoriteIds.toList());
    } catch (_) {}
  }
}
