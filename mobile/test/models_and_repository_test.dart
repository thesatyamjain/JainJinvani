import 'package:flutter_test/flutter_test.dart';
import 'package:jain_jinvani/models/content_item.dart';
import 'package:jain_jinvani/models/tirthankar.dart';
import 'package:jain_jinvani/models/festival.dart';

void main() {
  group('Verse Model Tests', () {
    test('parses json with list formats for original and translation', () {
      final json = {
        'number': '1',
        'original': ['ॐ नमः सिद्धेभ्यः', 'जय जिनेंद्र'],
        'translation': ['Salutations to the Siddhas', 'Victory to the Jinas'],
        'explanation': 'Mangalacharan',
      };

      final verse = Verse.fromJson(json);
      expect(verse.number, '1');
      expect(verse.original.length, 2);
      expect(verse.translation.length, 2);
      expect(verse.explanation, 'Mangalacharan');
      expect(verse.displayOriginalLines, ['ॐ नमः सिद्धेभ्यः', 'जय जिनेंद्र']);
      expect(verse.displayTranslationLines, ['Salutations to the Siddhas', 'Victory to the Jinas']);
    });

    test('falls back to sanskrit/hindi strings when lists are empty', () {
      final json = {
        'sanskrit': 'प्रथम पंक्ति\nद्वितीय पंक्ति',
        'hindi': 'पहला अर्थ\nदूसरा अर्थ',
      };

      final verse = Verse.fromJson(json);
      expect(verse.original, isEmpty);
      expect(verse.translation, isEmpty);
      expect(verse.displayOriginalLines, ['प्रथम पंक्ति', 'द्वितीय पंक्ति']);
      expect(verse.displayTranslationLines, ['पहला अर्थ', 'दूसरा अर्थ']);
    });
  });

  group('InventoryItem & ContentDetail Tests', () {
    test('parses InventoryItem json correctly', () {
      final json = {
        'id': 'bhaktamar_stotra',
        'title': 'भक्तामर स्तोत्र',
        'subCategory': 'stotra',
        'author': 'आचार्य मानतुंग',
        'description': 'आदिनाथ भगवान की स्तुति',
      };

      final item = InventoryItem.fromJson(json);
      expect(item.id, 'bhaktamar_stotra');
      expect(item.title, 'भक्तामर स्तोत्र');
      expect(item.author, 'आचार्य मानतुंग');
      expect(item.subCategory, 'stotra');
    });

    test('parses ContentDetail with verses and audio mapping', () {
      final json = {
        'id': 'samayik_path',
        'title': 'सामायिक पाठ',
        'verses': [
          {
            'number': '1',
            'original': ['करेमि भंते सामाइयं'],
            'translation': ['हे भगवान! मैं सामायिक करता हूँ'],
          }
        ],
        'audioUrl': 'https://example.com/audio.mp3',
      };

      final detail = ContentDetail.fromJson(json);
      expect(detail.id, 'samayik_path');
      expect(detail.title, 'सामायिक पाठ');
      expect(detail.verses.length, 1);
      expect(detail.verses.first.number, '1');
      expect(detail.audioUrl, 'https://example.com/audio.mp3');
    });
  });

  group('Tirthankar & Festival Models', () {
    test('parses Tirthankar json with attributes', () {
      final json = {
        'id': 'adinath',
        'nameHindi': 'भगवान ऋषभदेव / आदिनाथ',
        'nameEn': 'Rishabhanatha',
        'symbol': 'वृषभ (बैल)',
        'color': 'स्वर्ण',
        'birthPlace': 'अयोध्या',
        'nirvanaPlace': 'कैलाश पर्वत / अष्टापद',
      };

      final tirthankar = Tirthankar.fromJson(json);
      expect(tirthankar.id, 'adinath');
      expect(tirthankar.nameHindi, contains('आदिनाथ'));
      expect(tirthankar.nameEn, 'Rishabhanatha');
      expect(tirthankar.symbol, contains('वृषभ'));
      expect(tirthankar.color, 'स्वर्ण');
    });

    test('parses JainFestival json correctly', () {
      final json = {
        'id': 'paryushan',
        'name': 'पर्युषण पर्व / दसलक्षण महापर्व',
        'date': 'भाद्रपद शुक्ल पंचमी से चतुर्दशी',
        'description': 'दशलक्षण धर्म की आराधना का महापर्व',
      };

      final festival = JainFestival.fromJson(json);
      expect(festival.id, 'paryushan');
      expect(festival.name, contains('दसलक्षण'));
      expect(festival.date, contains('भाद्रपद'));
    });
  });
}
