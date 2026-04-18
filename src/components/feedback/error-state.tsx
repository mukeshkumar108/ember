import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '@/components/ui';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

type ErrorStateProps = {
  message: string;
  title?: string;
  onRetry?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ErrorState({
  message,
  title = 'Something went wrong',
  onRetry,
  secondaryActionLabel,
  onSecondaryAction,
  fullScreen = false,
  style,
}: ErrorStateProps) {
  const { colors } = useTheme();
  return (
    <View style={[staticStyles.container, fullScreen ? staticStyles.fullScreen : null, style]}>
      <View style={[staticStyles.iconContainer, { backgroundColor: `${colors.danger}18` }]}>
        <Text style={[staticStyles.icon, { color: colors.danger }]}>!</Text>
      </View>
      <View style={staticStyles.text}>
        <Text style={[staticStyles.title, { color: colors.foreground }]}>{title}</Text>
        <Text style={[staticStyles.message, { color: colors.foregroundSecondary }]}>{message}</Text>
      </View>
      {onRetry ? <Button label="Try Again" onPress={onRetry} variant="secondary" size="sm" /> : null}
      {secondaryActionLabel && onSecondaryAction ? (
        <Button label={secondaryActionLabel} onPress={onSecondaryAction} variant="ghost" size="sm" />
      ) : null}
    </View>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.xl,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontFamily: tokens.typography.fonts.bold,
    fontSize: tokens.typography.sizes.xl,
  },
  text: {
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  title: {
    fontFamily: tokens.typography.fonts.semibold,
    fontSize: tokens.typography.sizes.base,
    textAlign: 'center',
  },
  message: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
  },
});
