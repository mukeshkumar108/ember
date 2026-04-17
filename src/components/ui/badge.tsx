import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
type BadgeSize = 'sm' | 'md';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, variant = 'neutral', size = 'md', style }: BadgeProps) {
  return (
    <View style={[styles.base, sizeStyles[size], variantStyles[variant], style]}>
      <Text style={[styles.text, textSizeStyles[size], textVariantStyles[variant]]}>{label}</Text>
    </View>
  );
}

const ALPHA = '22'; // 13% opacity hex suffix

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: tokens.typography.weights.semibold,
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

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: `${tokens.colors.primary}${ALPHA}` },
  success: { backgroundColor: `${tokens.colors.success}${ALPHA}` },
  warning: { backgroundColor: `${tokens.colors.warning}${ALPHA}` },
  danger: { backgroundColor: `${tokens.colors.danger}${ALPHA}` },
  neutral: { backgroundColor: tokens.colors.backgroundSecondary },
});

const textSizeStyles = StyleSheet.create({
  sm: { fontSize: tokens.typography.sizes.xs },
  md: { fontSize: tokens.typography.sizes.sm },
});

const textVariantStyles = StyleSheet.create({
  primary: { color: tokens.colors.primary },
  // Darkened to pass WCAG AA on the 13%-tinted backgrounds
  success: { color: '#1A7A32' },
  warning: { color: '#7A4A00' },
  danger: { color: tokens.colors.danger },
  neutral: { color: tokens.colors.foregroundSecondary },
});
