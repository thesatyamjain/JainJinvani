import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class DockNavigation extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTabSelected;

  const DockNavigation({
    super.key,
    required this.currentIndex,
    required this.onTabSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xF2090B14),
        border: const Border(
          top: BorderSide(color: AppTheme.borderSubtle, width: 1),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.6),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, 'गृह', Icons.home_rounded),
              _buildNavItem(1, 'साधना', Icons.self_improvement_rounded),
              _buildNavItem(2, 'जिनवाणी', Icons.menu_book_rounded),
              _buildNavItem(3, 'तीर्थंकर', Icons.brightness_7_rounded),
              _buildNavItem(4, 'अधिक', Icons.more_horiz_rounded),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, String label, IconData icon) {
    final bool isSelected = currentIndex == index;

    return InkWell(
      onTap: () => onTabSelected(index),
      borderRadius: BorderRadius.circular(12),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.gold.withValues(alpha: 0.12) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: isSelected
              ? Border.all(color: AppTheme.gold.withValues(alpha: 0.3), width: 1)
              : Border.all(color: Colors.transparent, width: 1),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 22,
              color: isSelected ? AppTheme.goldLight : AppTheme.textMuted,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                color: isSelected ? AppTheme.goldLight : AppTheme.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
