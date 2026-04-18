import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

type DividerProps = {
  /** Optional centered label — useful for "or" dividers between form sections */
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
};

export function Divider({ label, orientation = 'horizontal', style }: DividerProps) {
  const { colors } = useTheme();

  if (orientation === 'vertical') {
    return <View style={[staticStyles.vertical, { backgroundColor: colors.border }, style]} />;
  }

  if (label) {
    return (
      <View style={[staticStyles.row, style]}>
        <View style={[staticStyles.line, { backgroundColor: colors.border }]} />
        <Text style={[staticStyles.label, { color: colors.muted }]}>{label}</Text>
        <View style={[staticStyles.line, { backgroundColor: colors.border }]} />
      </View>
    );
  }

  return <View style={[staticStyles.horizontal, { backgroundColor: colors.border }, style]} />;
}

const staticStyles = StyleSheet.create({
  horizontal: {
    height: 1,
  },
  vertical: {
    width: 1,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.sm,
  },
});
