import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jain_jinvani/services/niyam_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('NiyamService Unit Tests', () {
    test('initializes with default niyams and zero completion by default', () async {
      final service = NiyamService();
      await service.init();

      expect(service.totalCount, 8);
      expect(service.completedCount, 0);
      expect(service.progress, 0.0);
      expect(service.isCompleted('water_filtering'), false);
    });

    test('toggling a niyam updates state and progress accurately', () async {
      final service = NiyamService();
      await service.init();

      await service.toggle('water_filtering');
      expect(service.isCompleted('water_filtering'), true);
      expect(service.completedCount, 1);
      expect(service.progress, 1 / 8);

      // Toggle off
      await service.toggle('water_filtering');
      expect(service.isCompleted('water_filtering'), false);
      expect(service.completedCount, 0);
      expect(service.progress, 0.0);
    });

    test('loads previously stored completed niyams for today', () async {
      final now = DateTime.now();
      final todayStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';

      SharedPreferences.setMockInitialValues({
        'niyam_date': todayStr,
        'niyam_completed': ['night_eating', 'namokar_mantra'],
        'niyam_streak': 3,
      });

      final service = NiyamService();
      await service.init();

      expect(service.isCompleted('night_eating'), true);
      expect(service.isCompleted('namokar_mantra'), true);
      expect(service.isCompleted('swadhyay'), false);
      expect(service.completedCount, 2);
      expect(service.streak, 3);
    });
  });
}
