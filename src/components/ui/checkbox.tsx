import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/styles/tokens';
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

  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={description ? `${label}, ${description}` : label}
        accessibilityState={{ checked, disabled }}
        disabled={disabled}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.row,
          disabled ? styles.disabled : null,
          pressed && !disabled ? styles.pressed : null,
        ]}>
        <Animated.View style={[styles.box, checked ? styles.boxChecked : null, animatedBoxStyle]}>
          {checked ? <Check size={13} color={tokens.colors.background} strokeWidth={3} /> : null}
        </Animated.View>
        <View style={styles.textGroup}>
          <Text style={styles.label}>{label}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.background,
    marginTop: 1, // optical alignment with label text
  },
  boxChecked: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primary,
  },
  textGroup: {
    flex: 1,
    gap: tokens.spacing.xs,
  },
  label: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.medium,
    lineHeight: tokens.typography.sizes.base * tokens.typography.lineHeights.normal,
  },
  description: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
  error: {
    color: tokens.colors.danger,
    fontSize: tokens.typography.sizes.sm,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.7,
  },
});
