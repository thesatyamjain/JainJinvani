import 'package:flutter/foundation.dart';
import 'package:audioplayers/audioplayers.dart';

class AppAudioService extends ChangeNotifier {
  static final AppAudioService _instance = AppAudioService._internal();
  factory AppAudioService() => _instance;
  AppAudioService._internal() {
    _init();
  }

  final AudioPlayer _player = AudioPlayer();
  final AudioPlayer _bellPlayer = AudioPlayer();

  bool _isPlaying = false;
  String? _currentContentId;
  String? _currentTitle;
  Duration _position = Duration.zero;
  Duration _duration = Duration.zero;

  bool get isPlaying => _isPlaying;
  String? get currentContentId => _currentContentId;
  String? get currentTitle => _currentTitle;
  Duration get position => _position;
  Duration get duration => _duration;

  // Track map for audio assets
  static const Map<String, String> audioAssetMap = {
    'bhaktamar_stotra': 'audio/Bhaktamar_Stotra.mp3',
    'bhaktamar-stotra': 'audio/Bhaktamar_Stotra.mp3',
    'namokar-mantra': 'audio/Namokar_Mantra.mp3',
    'panch-parmeshthi-arti': 'audio/Panch_Parmeshthi_Aarti.mp3',
    'panch-parmeshthi-aarti': 'audio/Panch_Parmeshthi_Aarti.mp3',
  };

  static bool hasAudioTrack(String contentId) {
    return audioAssetMap.containsKey(contentId);
  }

  void _init() {
    _player.onPlayerStateChanged.listen((state) {
      _isPlaying = (state == PlayerState.playing);
      notifyListeners();
    });

    _player.onPositionChanged.listen((pos) {
      _position = pos;
      notifyListeners();
    });

    _player.onDurationChanged.listen((dur) {
      _duration = dur;
      notifyListeners();
    });
  }

  Future<void> playContentAudio(String contentId, String title) async {
    final assetPath = audioAssetMap[contentId];
    if (assetPath == null) return;

    if (_currentContentId == contentId && _isPlaying) {
      await pause();
      return;
    }

    _currentContentId = contentId;
    _currentTitle = title;
    await _player.stop();
    await _player.play(AssetSource(assetPath));
    _isPlaying = true;
    notifyListeners();
  }

  Future<void> playTempleBell() async {
    try {
      await _bellPlayer.stop();
      await _bellPlayer.play(AssetSource('audio/temple_bell.mp3'));
    } catch (_) {}
  }

  Future<void> pause() async {
    await _player.pause();
    _isPlaying = false;
    notifyListeners();
  }

  Future<void> resume() async {
    await _player.resume();
    _isPlaying = true;
    notifyListeners();
  }

  Future<void> seek(Duration pos) async {
    await _player.seek(pos);
  }

  Future<void> stop() async {
    await _player.stop();
    _isPlaying = false;
    _currentContentId = null;
    _currentTitle = null;
    _position = Duration.zero;
    notifyListeners();
  }

  @override
  void dispose() {
    _player.dispose();
    _bellPlayer.dispose();
    super.dispose();
  }
}
