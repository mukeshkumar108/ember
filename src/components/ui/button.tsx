import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { tokens } from '@/styles/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle =
    variant === 'secondary'
      ? styles.secondary
      : variant === 'danger'
        ? styles.danger
        : styles.primary;
  const textStyle =
    variant === 'secondary' ? styles.secondaryText : variant === 'danger' ? styles.dangerText : styles.primaryText;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      disabled={isDisabled}
      {...props}>
      {loading ? <ActivityIndicator size="small" color={variant === 'secondary' ? tokens.colors.foreground : tokens.colors.background} /> : null}
      <Text style={[styles.textBase, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  primary: {
    backgroundColor: tokens.colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.colors.muted,
  },
  danger: {
    backgroundColor: tokens.colors.danger,
  },
  textBase: {
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.medium,
  },
  primaryText: {
    color: tokens.colors.background,
  },
  secondaryText: {
    color: tokens.colors.foreground,
  },
  dangerText: {
    color: tokens.colors.background,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
  },
});
