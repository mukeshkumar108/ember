import React from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';

type CardVariant = 'default' | 'elevated' | 'outlined';

type CardProps = ViewProps & {
  variant?: CardVariant;
};

type PressableCardProps = Omit<PressableProps, 'style'> & {
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * Static card container.
 */
export function Card({ style, variant = 'default', ...props }: CardProps) {
  return <View style={[styles.base, variantStyles[variant], style]} {...props} />;
}

/**
 * Tappable card — for list rows, settings cells, and any pressable surface.
 */
export function PressableCard({ style, variant = 'default', children, ...props }: PressableCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.base, variantStyles[variant], pressed ? styles.pressed : null, style]}
      {...props}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
});

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: tokens.colors.backgroundSecondary,
  },
  elevated: {
    backgroundColor: tokens.colors.background,
    ...tokens.shadow.md,
  },
  outlined: {
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
});
