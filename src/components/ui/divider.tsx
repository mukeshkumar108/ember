import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';

type DividerProps = {
  /** Optional centered label — useful for "or" dividers between form sections */
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
};

export function Divider({ label, orientation = 'horizontal', style }: DividerProps) {
  if (orientation === 'vertical') {
    return <View style={[styles.vertical, style]} />;
  }

  if (label) {
    return (
      <View style={[styles.row, style]}>
        <View style={styles.line} />
        <Text style={styles.label}>{label}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={[styles.horizontal, style]} />;
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: tokens.colors.border,
  },
  vertical: {
    width: 1,
    backgroundColor: tokens.colors.border,
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
    backgroundColor: tokens.colors.border,
  },
  label: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
  },
});
