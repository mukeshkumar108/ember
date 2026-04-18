import React from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

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
  const { colors } = useTheme();

  return (
    <View style={[staticStyles.container, style]} {...props}>
      {title ? (
        <View style={staticStyles.header}>
          <Text style={[staticStyles.title, { color: colors.muted }]}>{title.toUpperCase()}</Text>
          {description ? (
            <Text style={[staticStyles.description, { color: colors.muted }]}>{description}</Text>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    gap: tokens.spacing.sm,
  },
  header: {
    gap: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.xs,
  },
  title: {
    fontFamily: tokens.typography.fonts.semibold,
    fontSize: tokens.typography.sizes.xs,
    letterSpacing: 0.8,
  },
  description: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
});
