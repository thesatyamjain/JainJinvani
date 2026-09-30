import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class NiyamItem {
  final String id;
  final String title;
  final String description;
  final String icon;

  const NiyamItem({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
  });
}

class NiyamService extends ChangeNotifier {
  static final NiyamService _instance = NiyamService._internal();
  factory NiyamService() => _instance;
  NiyamService._internal();

  static const List<NiyamItem> defaultNiyams = [
    NiyamItem(
      id: 'water_filtering',
      title: 'प्रासुक / छना हुआ जल ग्रहण',
      description: 'द्विपुट वस्त्र से छना हुआ मर्यादित जल ही पीना।',
      icon: '💧',
    ),
    NiyamItem(
      id: 'night_eating',
      title: 'रात्रि भोजन त्याग (चारों प्रकार)',
      description: 'सूर्यास्त के उपरांत खाद्य, स्वाद्य, लेह्य, पेय का त्याग।',
      icon: '🌙',
    ),
    NiyamItem(
      id: 'namokar_mantra',
      title: 'णमोकार महामंत्र स्मरण (१०८ बार)',
      description: 'प्रातःकाल अथवा सांध्यकाल में मनका जाप।',
      icon: '📿',
    ),
    NiyamItem(
      id: 'jin_darshan',
      title: 'श्री जिनेंद्र देव दर्शन एवं वंदना',
      description: 'प्रतिदिन मंदिर जी में वीतराग प्रभु का दर्शन।',
      icon: '🛕',
    ),
    NiyamItem(
      id: 'swadhyay',
      title: 'नित्य जिनवाणी स्वाध्याय',
      description: 'कम से कम १५ मिनट आगम अथवा स्तोत्र का वाचन।',
      icon: '📖',
    ),
    NiyamItem(
      id: 'kandmool',
      title: 'जमीकंद / कंदमूल त्याग',
      description: 'आलू, प्याज, लहसुन, गाजर आदि अनंतकायिक का त्याग।',
      icon: '🌱',
    ),
    NiyamItem(
      id: 'samayik',
      title: 'सामायिक / समता साधना',
      description: 'आत्म-चिंतन, इर्यावही एवं दोषों की आलोचना।',
      icon: '🧘',
    ),
    NiyamItem(
      id: 'ahimsa_speech',
      title: 'अहिंसा एवं प्रिय वचन',
      description: 'किसी के प्रति कटु, मिथ्या अथवा कर्कश वचन न बोलना।',
      icon: '🕊️',
    ),
  ];

  Set<String> _completedNiyamIds = {};
  String _todayDateStr = '';
  int _streak = 1;

  Set<String> get completedIds => _completedNiyamIds;
  int get completedCount => _completedNiyamIds.length;
  int get totalCount => defaultNiyams.length;
  double get progress => totalCount > 0 ? completedCount / totalCount : 0.0;
  int get streak => _streak;

  String _getTodayKey() {
    final now = DateTime.now();
    return '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
  }

  Future<void> init() async {
    _todayDateStr = _getTodayKey();
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedDate = prefs.getString('niyam_date');
      _streak = prefs.getInt('niyam_streak') ?? 1;

      if (savedDate == _todayDateStr) {
        final list = prefs.getStringList('niyam_completed') ?? [];
        _completedNiyamIds = list.toSet();
      } else {
        // New day! Check if yesterday was completed for streak
        if (savedDate != null) {
          final yesterday = DateTime.now().subtract(const Duration(days: 1));
          final yKey = '${yesterday.year}-${yesterday.month.toString().padLeft(2, '0')}-${yesterday.day.toString().padLeft(2, '0')}';
          if (savedDate == yKey) {
            final yCompleted = prefs.getStringList('niyam_completed') ?? [];
            if (yCompleted.length >= 4) {
              _streak += 1;
              await prefs.setInt('niyam_streak', _streak);
            }
          }
        }
        _completedNiyamIds = {};
        await prefs.setString('niyam_date', _todayDateStr);
        await prefs.setStringList('niyam_completed', []);
      }
      notifyListeners();
    } catch (_) {}
  }

  bool isCompleted(String id) => _completedNiyamIds.contains(id);

  Future<void> toggle(String id) async {
    if (_completedNiyamIds.contains(id)) {
      _completedNiyamIds.remove(id);
    } else {
      _completedNiyamIds.add(id);
    }
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('niyam_date', _todayDateStr);
      await prefs.setStringList('niyam_completed', _completedNiyamIds.toList());
    } catch (_) {}
  }
}
