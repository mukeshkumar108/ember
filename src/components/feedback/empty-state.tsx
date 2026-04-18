import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Optional Lucide icon to render above the title */
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: IconComponent }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={staticStyles.container}>
      {IconComponent ? (
        <View style={[staticStyles.iconContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <IconComponent size={28} color={colors.muted} strokeWidth={1.5} />
        </View>
      ) : null}
      <Text style={[staticStyles.title, { color: colors.foreground }]}>{title}</Text>
      {description ? (
        <Text style={[staticStyles.description, { color: colors.muted }]}>{description}</Text>
      ) : null}
    </View>
  );
}

const staticStyles = StyleSheet.create({
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.xs,
  },
  title: {
    fontFamily: tokens.typography.fonts.semibold,
    fontSize: tokens.typography.sizes.base,
    textAlign: 'center',
  },
  description: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
});
