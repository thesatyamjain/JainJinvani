import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand color palette matching Jain Jinvani Web
  static const Color background = Color(0xFF05060A);
  static const Color surface = Color(0xFF0C0E17);
  static const Color surfaceElevated = Color(0xFF131726);
  static const Color surfaceCard = Color(0x99111422);

  static const Color gold = Color(0xFFF59E0B); // Amber 500
  static const Color goldLight = Color(0xFFFCD34D); // Amber 300
  static const Color goldDark = Color(0xFFB45309); // Amber 700
  static const Color goldAccent = Color(0xFFFBBF24); // Amber 400

  static const Color borderSubtle = Color(0x22FBBF24); // 13% amber
  static const Color borderMedium = Color(0x44FBBF24); // 27% amber

  static const Color textPrimary = Color(0xFFF8FAFC); // Slate 50
  static const Color textSecondary = Color(0xFFCBD5E1); // Slate 300
  static const Color textMuted = Color(0xFF94A3B8); // Slate 400

  static const Color saffron = Color(0xFFEA580C); // Orange 600

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: gold,
      colorScheme: const ColorScheme.dark(
        primary: gold,
        secondary: goldLight,
        surface: surface,
        surfaceContainerHighest: surfaceElevated,
        onPrimary: Colors.black,
        onSurface: textPrimary,
      ),
      textTheme: GoogleFonts.notoSansDevanagariTextTheme(
        const TextTheme(
          displayLarge: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: textPrimary,
            letterSpacing: -0.5,
            height: 1.2,
          ),
          displayMedium: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: textPrimary,
            letterSpacing: -0.3,
            height: 1.2,
          ),
          titleLarge: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: textPrimary,
            height: 1.3,
          ),
          titleMedium: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: textPrimary,
            height: 1.3,
          ),
          bodyLarge: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.normal,
            color: textSecondary,
            height: 1.6,
          ),
          bodyMedium: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.normal,
            color: textSecondary,
            height: 1.5,
          ),
          labelSmall: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w500,
            color: textMuted,
            letterSpacing: 0.5,
          ),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: goldLight),
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: surfaceElevated,
        selectedItemColor: gold,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      cardTheme: CardThemeData(
        color: surfaceCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: borderSubtle, width: 1),
        ),
      ),
    );
  }

  // Common glass decoration
  static BoxDecoration glassDecoration({
    double radius = 16,
    Color borderColor = borderSubtle,
    Color bgColor = surfaceCard,
    bool glow = false,
  }) {
    return BoxDecoration(
      color: bgColor,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: borderColor, width: 1),
      boxShadow: glow
          ? [
              BoxShadow(
                color: gold.withValues(alpha: 0.12),
                blurRadius: 16,
                spreadRadius: 1,
              )
            ]
          : null,
    );
  }
}
