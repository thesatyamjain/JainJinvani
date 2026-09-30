class JainFestival {
  final String id;
  final String name;
  final String nameHindi;
  final String date;
  final String description;
  final String descriptionHindi;
  final String? type;
  final bool recurring;

  const JainFestival({
    required this.id,
    required this.name,
    required this.nameHindi,
    required this.date,
    required this.description,
    required this.descriptionHindi,
    this.type,
    this.recurring = true,
  });

  factory JainFestival.fromJson(Map<String, dynamic> json) {
    return JainFestival(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      nameHindi: json['nameHindi']?.toString() ?? '',
      date: json['date']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      descriptionHindi: json['descriptionHindi']?.toString() ?? '',
      type: json['type']?.toString(),
      recurring: json['recurring'] == true,
    );
  }
}
