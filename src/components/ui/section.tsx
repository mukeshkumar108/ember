import React from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { tokens } from '@/styles/tokens';

type SectionProps = ViewProps & {
  title?: string;
  description?: string;
};

/**
 * Section groups related content with an optional iOS-style section header.
 *
 * Headers are rendered as small-caps labels, matching the visual hierarchy
 * of iOS grouped list sections (not competing with screen page titles).
 */
export function Section({ title, description, style, children, ...props }: SectionProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title.toUpperCase()}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.sm,
  },
  header: {
    gap: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.xs,
  },
  title: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.semibold,
    letterSpacing: 0.8,
  },
  description: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
});
