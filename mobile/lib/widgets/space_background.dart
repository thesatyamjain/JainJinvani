import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class SpaceBackground extends StatelessWidget {
  final Widget? child;

  const SpaceBackground({super.key, this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: const BoxDecoration(
        color: AppTheme.background,
        gradient: RadialGradient(
          center: Alignment(0.0, -0.6),
          radius: 1.2,
          colors: [
            Color(0x18F59E0B), // subtle warm amber zenith glow
            Color(0x081E293B), // slate deep space
            AppTheme.background, // base dark void #05060A
          ],
          stops: [0.0, 0.5, 1.0],
        ),
      ),
      child: child,
    );
  }
}
