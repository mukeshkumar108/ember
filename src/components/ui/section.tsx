import React from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { tokens } from '@/styles/tokens';

type SectionProps = ViewProps & {
  title?: string;
};

export function Section({ title, style, children, ...props }: SectionProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.md,
  },
  title: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.xl,
    fontWeight: tokens.typography.weights.bold,
  },
});
