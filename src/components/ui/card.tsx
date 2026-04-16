import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { tokens } from '@/styles/tokens';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: `${tokens.colors.muted}14`,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
});
