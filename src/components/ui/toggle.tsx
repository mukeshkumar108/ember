import React from 'react';
import { StyleSheet, Switch as RNSwitch, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/styles/tokens';

type ToggleProps = {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  description?: string;
  style?: StyleProp<ViewStyle>;
};

export function Toggle({
  label,
  value,
  onValueChange,
  disabled = false,
  description,
  style,
}: ToggleProps) {
  const handleChange = (next: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(next);
  };

  return (
    <View style={[styles.container, disabled ? styles.disabled : null, style]}>
      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <RNSwitch
        accessibilityLabel={label}
        disabled={disabled}
        onValueChange={handleChange}
        thumbColor={tokens.colors.background}
        trackColor={{ false: tokens.colors.border, true: tokens.colors.primary }}
        ios_backgroundColor={tokens.colors.border}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
  },
  textGroup: {
    flex: 1,
    gap: tokens.spacing.xs,
  },
  label: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.medium,
  },
  description: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
  disabled: {
    opacity: 0.45,
  },
});
