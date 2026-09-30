import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final double radius;
  final bool glow;
  final Color? borderColor;
  final Color? bgColor;

  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.onTap,
    this.radius = 16,
    this.glow = false,
    this.borderColor,
    this.bgColor,
  });

  @override
  Widget build(BuildContext context) {
    final cardContent = Container(
      decoration: AppTheme.glassDecoration(
        radius: radius,
        glow: glow,
        borderColor: borderColor ?? AppTheme.borderSubtle,
        bgColor: bgColor ?? AppTheme.surfaceCard,
      ),
      padding: padding,
      child: child,
    );

    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(radius),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(radius),
          splashColor: AppTheme.gold.withValues(alpha: 0.15),
          highlightColor: AppTheme.gold.withValues(alpha: 0.08),
          child: cardContent,
        ),
      );
    }

    return cardContent;
  }
}
