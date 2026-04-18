import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
type BadgeSize = 'sm' | 'md';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
};

const ALPHA = '22'; // ~13% opacity tint for backgrounds

export function Badge({ label, variant = 'neutral', size = 'md', style }: BadgeProps) {
  const { colors, isDark } = useTheme();

  // Text colors that pass WCAG AA on the tinted background in both themes
  const textColor: Record<BadgeVariant, string> = {
    primary: colors.primary,
    // Success/warning use darker text in light, brighter in dark
    success: isDark ? colors.success : '#1A7A32',
    warning: isDark ? colors.warning : '#7A4A00',
    danger: colors.danger,
    neutral: colors.foregroundSecondary,
  };

  const bgColor: Record<BadgeVariant, string> = {
    primary: `${colors.primary}${ALPHA}`,
    success: `${colors.success}${ALPHA}`,
    warning: `${colors.warning}${ALPHA}`,
    danger: `${colors.danger}${ALPHA}`,
    neutral: colors.backgroundSecondary,
  };

  return (
    <View style={[staticStyles.base, sizeStyles[size], { backgroundColor: bgColor[variant] }, style]}>
      <Text
        style={[
          staticStyles.text,
          textSizeStyles[size],
          { color: textColor[variant] },
        ]}>
        {label}
      </Text>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: tokens.typography.fonts.semibold,
    letterSpacing: 0.2,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
  },
});

const textSizeStyles = StyleSheet.create({
  sm: { fontSize: tokens.typography.sizes.xs },
  md: { fontSize: tokens.typography.sizes.sm },
});
