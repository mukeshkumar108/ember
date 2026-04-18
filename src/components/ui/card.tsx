import React from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

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
  const { colors } = useTheme();
  const variantStyle = cardVariantStyle(variant, colors);
  return <View style={[staticStyles.base, variantStyle, style]} {...props} />;
}

/**
 * Tappable card — for list rows, settings cells, and any pressable surface.
 */
export function PressableCard({ style, variant = 'default', children, ...props }: PressableCardProps) {
  const { colors } = useTheme();
  const variantStyle = cardVariantStyle(variant, colors);
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        staticStyles.base,
        variantStyle,
        pressed ? staticStyles.pressed : null,
        style,
      ]}
      {...props}>
      {children}
    </Pressable>
  );
}

function cardVariantStyle(variant: CardVariant, colors: ReturnType<typeof useTheme>['colors']) {
  switch (variant) {
    case 'elevated':
      return { backgroundColor: colors.backgroundElevated, ...tokens.shadow.md };
    case 'outlined':
      return { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border };
    default:
      return { backgroundColor: colors.backgroundSecondary };
  }
}

const staticStyles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
});
