import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';
import { useReduceMotion } from '@/hooks';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  description?: string;
  error?: string | null;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  description,
  error,
  style,
}: CheckboxProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (reduceMotion) {
      scale.value = withTiming(1, { duration: 0 });
    } else {
      scale.value = withSpring(0.85, { damping: 12, stiffness: 400 }, () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 400 });
      });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(!checked);
  };

  const boxStyle = {
    borderColor: checked ? colors.primary : colors.border,
    backgroundColor: checked ? colors.primary : colors.background,
  };

  return (
    <View style={[staticStyles.container, style]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={description ? `${label}, ${description}` : label}
        accessibilityState={{ checked, disabled }}
        disabled={disabled}
        onPress={handlePress}
        style={({ pressed }) => [
          staticStyles.row,
          disabled ? staticStyles.disabled : null,
          pressed && !disabled ? staticStyles.pressed : null,
        ]}>
        <Animated.View style={[staticStyles.box, boxStyle, animatedBoxStyle]}>
          {checked ? <Check size={13} color="#FFFFFF" strokeWidth={3} /> : null}
        </Animated.View>
        <View style={staticStyles.textGroup}>
          <Text style={[staticStyles.label, { color: colors.foreground }]}>{label}</Text>
          {description ? (
            <Text style={[staticStyles.description, { color: colors.muted }]}>{description}</Text>
          ) : null}
        </View>
      </Pressable>
      {error ? (
        <Text style={[staticStyles.error, { color: colors.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    gap: tokens.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.sm,
    minHeight: 44,
    paddingVertical: tokens.spacing.xs,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  textGroup: {
    flex: 1,
    gap: tokens.spacing.xs,
  },
  label: {
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.base,
    lineHeight: tokens.typography.sizes.base * tokens.typography.lineHeights.normal,
  },
  description: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
  error: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.7,
  },
});
