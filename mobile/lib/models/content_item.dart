class Verse {
  final String? number;
  final List<String> original;
  final List<String> translation;
  final String? explanation;
  final String? hindi;
  final String? sanskrit;

  const Verse({
    this.number,
    this.original = const [],
    this.translation = const [],
    this.explanation,
    this.hindi,
    this.sanskrit,
  });

  factory Verse.fromJson(Map<String, dynamic> json) {
    List<String> parseList(dynamic val) {
      if (val is List) {
        return val.map((e) => e.toString()).toList();
      } else if (val is String && val.isNotEmpty) {
        return val.split('\n');
      }
      return const [];
    }

    return Verse(
      number: json['number']?.toString(),
      original: parseList(json['original']),
      translation: parseList(json['translation']),
      explanation: json['explanation']?.toString(),
      hindi: json['hindi']?.toString(),
      sanskrit: json['sanskrit']?.toString(),
    );
  }

  // Helper to extract lines regardless of format
  List<String> get displayOriginalLines {
    if (original.isNotEmpty) return original;
    if (sanskrit != null && sanskrit!.isNotEmpty) return sanskrit!.split('\n');
    return const [];
  }

  List<String> get displayTranslationLines {
    if (translation.isNotEmpty) return translation;
    if (hindi != null && hindi!.isNotEmpty) return hindi!.split('\n');
    return const [];
  }
}

class Chapter {
  final String title;
  final List<String> content;

  const Chapter({
    required this.title,
    this.content = const [],
  });

  factory Chapter.fromJson(Map<String, dynamic> json) {
    List<String> lines = [];
    if (json['content'] is List) {
      lines = (json['content'] as List).map((e) => e.toString()).toList();
    } else if (json['content'] is String) {
      lines = (json['content'] as String).split('\n');
    }
    return Chapter(
      title: json['title']?.toString() ?? '',
      content: lines,
    );
  }
}

class ContentDetail {
  final String id;
  final String title;
  final String? subtitle;
  final String category;
  final String? type;
  final String? author;
  final String? meaning;
  final List<Verse> verses;
  final List<Chapter> chapters;
  final List<String> lyrics;
  final String? htmlContent;
  final String? audioUrl;

  const ContentDetail({
    required this.id,
    required this.title,
    this.subtitle,
    required this.category,
    this.type,
    this.author,
    this.meaning,
    this.verses = const [],
    this.chapters = const [],
    this.lyrics = const [],
    this.htmlContent,
    this.audioUrl,
  });

  factory ContentDetail.fromJson(Map<String, dynamic> json) {
    List<Verse> versesList = [];
    if (json['verses'] is List) {
      versesList = (json['verses'] as List)
          .map((v) => Verse.fromJson(Map<String, dynamic>.from(v)))
          .toList();
    }

    List<Chapter> chaptersList = [];
    if (json['chapters'] is List) {
      chaptersList = (json['chapters'] as List)
          .map((c) => Chapter.fromJson(Map<String, dynamic>.from(c)))
          .toList();
    }

    List<String> lyricsList = [];
    if (json['lyrics'] is List) {
      lyricsList = (json['lyrics'] as List).map((e) => e.toString()).toList();
    } else if (json['lyrics'] is String) {
      lyricsList = (json['lyrics'] as String).split('\n');
    }

    return ContentDetail(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      subtitle: json['subtitle']?.toString(),
      category: json['category']?.toString() ?? json['type']?.toString() ?? 'stotra',
      type: json['type']?.toString(),
      author: json['author']?.toString(),
      meaning: json['meaning']?.toString(),
      verses: versesList,
      chapters: chaptersList,
      lyrics: lyricsList,
      htmlContent: json['content'] is String ? json['content'] as String : null,
      audioUrl: json['audioUrl']?.toString(),
    );
  }
}

class InventoryItem {
  final String id;
  final String title;
  final String category;
  final String? subCategory;
  final String? description;
  final String? badge;
  final String? author;
  final String? audioUrl;

  const InventoryItem({
    required this.id,
    required this.title,
    required this.category,
    this.subCategory,
    this.description,
    this.badge,
    this.author,
    this.audioUrl,
  });

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    return InventoryItem(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      subCategory: json['subCategory']?.toString(),
      description: json['description']?.toString(),
      badge: json['badge']?.toString(),
      author: json['author']?.toString(),
      audioUrl: json['audioUrl']?.toString(),
    );
  }
}

class SubCategoryDef {
  final String id;
  final String label;
  final String? description;

  const SubCategoryDef({
    required this.id,
    required this.label,
    this.description,
  });

  factory SubCategoryDef.fromJson(Map<String, dynamic> json) {
    return SubCategoryDef(
      id: json['id']?.toString() ?? '',
      label: json['label']?.toString() ?? '',
      description: json['description']?.toString(),
    );
  }
}
