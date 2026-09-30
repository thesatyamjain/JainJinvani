import 'package:flutter_test/flutter_test.dart';
import 'package:jain_jinvani/main.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Jain Jinvani App loads successfully', (WidgetTester tester) async {
    await tester.pumpWidget(const JainJinvaniApp());
    expect(find.byType(JainJinvaniApp), findsOneWidget);
    expect(find.text('जैन जिनवाणी लोड हो रहा है...'), findsOneWidget);
  });
}
