import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { tokens } from '@/styles/tokens';

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Optional Lucide icon to render above the title */
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: IconComponent }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {IconComponent ? (
        <View style={styles.iconContainer}>
          <IconComponent size={28} color={tokens.colors.muted} strokeWidth={1.5} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    padding: tokens.spacing['3xl'],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.xs,
  },
  title: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.semibold,
    textAlign: 'center',
  },
  description: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
});
