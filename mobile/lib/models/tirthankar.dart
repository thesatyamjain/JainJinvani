class KalyanakDates {
  final String? garbha;
  final String? janma;
  final String? tap;
  final String? gyan;
  final String? moksha;

  const KalyanakDates({
    this.garbha,
    this.janma,
    this.tap,
    this.gyan,
    this.moksha,
  });

  factory KalyanakDates.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const KalyanakDates();
    return KalyanakDates(
      garbha: json['garbha']?.toString(),
      janma: json['janma']?.toString(),
      tap: json['tap']?.toString(),
      gyan: json['gyan']?.toString(),
      moksha: json['moksha']?.toString(),
    );
  }
}

class Tirthankar {
  final String id;
  final int number;
  final String nameHindi;
  final String nameEn;
  final String titleHindi;
  final String? subtitleHindi;
  final String symbol;
  final String symbolEmoji;
  final String color;
  final String father;
  final String mother;
  final String birthPlace;
  final String nirvanaPlace;
  final String? kevalgyanTree;
  final String? yakshaYakshini;
  final String? dynasty;
  final String? age;
  final String? mantra;
  final String? bioHindi;
  final String? chalisaId;
  final String? artiId;
  final String? pujaId;
  final KalyanakDates kalyanak;

  const Tirthankar({
    required this.id,
    required this.number,
    required this.nameHindi,
    required this.nameEn,
    required this.titleHindi,
    this.subtitleHindi,
    required this.symbol,
    required this.symbolEmoji,
    required this.color,
    required this.father,
    required this.mother,
    required this.birthPlace,
    required this.nirvanaPlace,
    this.kevalgyanTree,
    this.yakshaYakshini,
    this.dynasty,
    this.age,
    this.mantra,
    this.bioHindi,
    this.chalisaId,
    this.artiId,
    this.pujaId,
    this.kalyanak = const KalyanakDates(),
  });

  factory Tirthankar.fromJson(Map<String, dynamic> json) {
    return Tirthankar(
      id: json['id']?.toString() ?? '',
      number: (json['number'] is int) ? json['number'] : int.tryParse(json['number']?.toString() ?? '0') ?? 0,
      nameHindi: json['nameHindi']?.toString() ?? '',
      nameEn: json['nameEn']?.toString() ?? '',
      titleHindi: json['titleHindi']?.toString() ?? json['nameHindi']?.toString() ?? '',
      subtitleHindi: json['subtitleHindi']?.toString(),
      symbol: json['symbol']?.toString() ?? '',
      symbolEmoji: json['symbolEmoji']?.toString() ?? '✨',
      color: json['color']?.toString() ?? '',
      father: json['father']?.toString() ?? '',
      mother: json['mother']?.toString() ?? '',
      birthPlace: json['birthPlace']?.toString() ?? '',
      nirvanaPlace: json['nirvanaPlace']?.toString() ?? '',
      kevalgyanTree: json['kevalgyanTree']?.toString(),
      yakshaYakshini: json['yakshaYakshini']?.toString(),
      dynasty: json['dynasty']?.toString(),
      age: json['age']?.toString(),
      mantra: json['mantra']?.toString(),
      bioHindi: json['bioHindi']?.toString(),
      chalisaId: json['chalisaId']?.toString(),
      artiId: json['artiId']?.toString(),
      pujaId: json['pujaId']?.toString(),
      kalyanak: KalyanakDates.fromJson(json['kalyanak'] as Map<String, dynamic>?),
    );
  }
}
