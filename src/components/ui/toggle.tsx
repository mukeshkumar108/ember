import React from 'react';
import { StyleSheet, Switch as RNSwitch, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

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
  const { colors } = useTheme();

  const handleChange = (next: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(next);
  };

  return (
    <View style={[staticStyles.container, disabled ? staticStyles.disabled : null, style]}>
      <View style={staticStyles.textGroup}>
        <Text style={[staticStyles.label, { color: colors.foreground }]}>{label}</Text>
        {description ? (
          <Text style={[staticStyles.description, { color: colors.muted }]}>{description}</Text>
        ) : null}
      </View>
      <RNSwitch
        accessibilityLabel={label}
        disabled={disabled}
        onValueChange={handleChange}
        thumbColor="#FFFFFF"
        trackColor={{ false: colors.border, true: colors.primary }}
        ios_backgroundColor={colors.border}
        value={value}
      />
    </View>
  );
}

const staticStyles = StyleSheet.create({
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
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.base,
  },
  description: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
  disabled: {
    opacity: 0.45,
  },
});
