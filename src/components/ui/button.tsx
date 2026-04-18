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
import { useTheme } from '@/providers/theme-provider';

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
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const handlePress: PressableProps['onPress'] = (e) => {
    if (variant !== 'ghost') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const variantBg: Record<ButtonVariant, string> = {
    primary: colors.primary,
    secondary: 'transparent',
    danger: colors.danger,
    ghost: 'transparent',
  };

  const variantBorder: Record<ButtonVariant, object> = {
    primary: {},
    secondary: { borderWidth: 1.5, borderColor: colors.border },
    danger: {},
    ghost: {},
  };

  const variantTextColor: Record<ButtonVariant, string> = {
    primary: '#FFFFFF',
    secondary: colors.foreground,
    danger: '#FFFFFF',
    ghost: colors.primary,
  };

  const indicatorColor = variant === 'secondary' || variant === 'ghost' ? colors.primary : '#FFFFFF';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={loading ? `${label}, loading` : label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        staticStyles.base,
        sizeStyles[size],
        { backgroundColor: variantBg[variant] },
        variantBorder[variant],
        pressed && !isDisabled ? staticStyles.pressed : null,
        isDisabled ? staticStyles.disabled : null,
        style,
      ]}
      disabled={isDisabled}
      onPress={handlePress}
      {...props}>
      {loading ? <ActivityIndicator size="small" color={indicatorColor} /> : null}
      <Text
        style={[staticStyles.textBase, textSizeStyles[size], { color: variantTextColor[variant] }]}
        accessibilityElementsHidden>
        {label}
      </Text>
    </Pressable>
  );
}

const staticStyles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  textBase: {
    fontFamily: tokens.typography.fonts.semibold,
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

const textSizeStyles = StyleSheet.create({
  sm: { fontSize: tokens.typography.sizes.sm },
  md: { fontSize: tokens.typography.sizes.base },
  lg: { fontSize: tokens.typography.sizes.lg },
});
