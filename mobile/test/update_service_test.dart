import 'package:flutter_test/flutter_test.dart';
import 'package:jain_jinvani/services/update_service.dart';

void main() {
  group('UpdateService Unit Tests', () {
    test('parseVersionParts strips prefixes and suffixes correctly', () {
      expect(UpdateService.parseVersionParts('1.0.3'), [1, 0, 3]);
      expect(UpdateService.parseVersionParts('v1.2.0'), [1, 2, 0]);
      expect(UpdateService.parseVersionParts('V2.10.4+8'), [2, 10, 4]);
      expect(UpdateService.parseVersionParts('1.0'), [1, 0]);
      expect(UpdateService.parseVersionParts(''), [0]);
    });

    test('parseBuildNumber extracts integer build code', () {
      expect(UpdateService.parseBuildNumber('1.0.3+5'), 5);
      expect(UpdateService.parseBuildNumber('v1.0.3+12'), 12);
      expect(UpdateService.parseBuildNumber('1.0.3'), isNull);
    });

    test('isNewerVersion detects major, minor, and patch upgrades', () {
      // Major upgrade
      expect(UpdateService.isNewerVersion('2.0.0', '1.9.9'), isTrue);
      // Minor upgrade
      expect(UpdateService.isNewerVersion('1.1.0', '1.0.9'), isTrue);
      // Patch upgrade
      expect(UpdateService.isNewerVersion('1.0.4', '1.0.3'), isTrue);

      // Same or older
      expect(UpdateService.isNewerVersion('1.0.3', '1.0.3'), isFalse);
      expect(UpdateService.isNewerVersion('1.0.2', '1.0.3'), isFalse);
      expect(UpdateService.isNewerVersion('0.9.9', '1.0.0'), isFalse);
    });

    test('isNewerVersion compares build numbers when semver is identical', () {
      // Higher build number
      expect(
        UpdateService.isNewerVersion('1.0.3', '1.0.3', remoteBuild: 6, currentBuild: 5),
        isTrue,
      );
      // Same build number
      expect(
        UpdateService.isNewerVersion('1.0.3', '1.0.3', remoteBuild: 5, currentBuild: 5),
        isFalse,
      );
      // Lower build number
      expect(
        UpdateService.isNewerVersion('1.0.3', '1.0.3', remoteBuild: 4, currentBuild: 5),
        isFalse,
      );
      // Embedded + build string
      expect(UpdateService.isNewerVersion('1.0.3+7', '1.0.3+6'), isTrue);
      expect(UpdateService.isNewerVersion('1.0.3+6', '1.0.3+7'), isFalse);
    });

    test('isBelowMinVersion correctly flags mandatory updates', () {
      expect(UpdateService.isBelowMinVersion('0.9.8', '1.0.0'), isTrue);
      expect(UpdateService.isBelowMinVersion('1.0.0', '1.0.0'), isFalse);
      expect(UpdateService.isBelowMinVersion('1.0.3', '1.0.0'), isFalse);
      expect(UpdateService.isBelowMinVersion('1.0.1', '1.0.2'), isTrue);
    });

    test('UpdateInfo model stores all enterprise fields', () {
      final info = UpdateInfo(
        tagName: 'v1.0.4',
        cleanVersion: '1.0.4',
        versionCode: 5,
        title: 'अत्यावश्यक सुरक्षा अपडेट v1.0.4',
        notes: '• महत्वपूर्ण बग सुधार',
        downloadUrl: 'https://example.com/app-arm64.apk',
        universalUrl: 'https://example.com/app-universal.apk',
        appStoreUrl: 'https://apps.apple.com/app/id123',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        sizeMb: 35.5,
        isMandatory: true,
        minSupportedVersion: '1.0.0',
      );

      expect(info.tagName, 'v1.0.4');
      expect(info.cleanVersion, '1.0.4');
      expect(info.versionCode, 5);
      expect(info.isMandatory, isTrue);
      expect(info.sha256, isNotNull);
      expect(info.universalUrl, isNotNull);
      expect(info.appStoreUrl, isNotNull);
      expect(info.sizeMb, 35.5);
    });
  });
}
