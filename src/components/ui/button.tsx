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
import * as Haptics from 'expo-haptics';
import { tokens } from '@/styles/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  onPress,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const handlePress: PressableProps['onPress'] = (e) => {
    if (variant !== 'ghost') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={loading ? `${label}, loading` : label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      disabled={isDisabled}
      onPress={handlePress}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'ghost' ? tokens.colors.primary : tokens.colors.background}
        />
      ) : null}
      <Text style={[styles.textBase, textSizeStyles[size], textVariantStyles[variant]]} accessibilityElementsHidden>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  textBase: {
    fontWeight: tokens.typography.weights.semibold,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    minHeight: 36,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
  },
  md: {
    minHeight: 50,
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.md,
  },
  lg: {
    minHeight: 56,
    paddingHorizontal: tokens.spacing['2xl'],
    paddingVertical: tokens.spacing.lg,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: tokens.colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: tokens.colors.border,
  },
  danger: {
    backgroundColor: tokens.colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

const textVariantStyles = StyleSheet.create({
  primary: {
    color: tokens.colors.background,
  },
  secondary: {
    color: tokens.colors.foreground,
  },
  danger: {
    color: tokens.colors.background,
  },
  ghost: {
    color: tokens.colors.primary,
  },
});

const textSizeStyles = StyleSheet.create({
  sm: {
    fontSize: tokens.typography.sizes.sm,
  },
  md: {
    fontSize: tokens.typography.sizes.base,
  },
  lg: {
    fontSize: tokens.typography.sizes.lg,
  },
});
