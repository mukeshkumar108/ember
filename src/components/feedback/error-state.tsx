import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '@/components/ui';
import { tokens } from '@/styles/tokens';

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
  return (
    <View style={[styles.container, fullScreen ? styles.fullScreen : null, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>!</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {onRetry ? <Button label="Try Again" onPress={onRetry} variant="secondary" size="sm" /> : null}
      {secondaryActionLabel && onSecondaryAction ? (
        <Button label={secondaryActionLabel} onPress={onSecondaryAction} variant="ghost" size="sm" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.xl,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.full,
    backgroundColor: `${tokens.colors.danger}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: tokens.colors.danger,
    fontSize: tokens.typography.sizes.xl,
    fontWeight: tokens.typography.weights.bold,
  },
  text: {
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  title: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.semibold,
    textAlign: 'center',
  },
  message: {
    color: tokens.colors.foregroundSecondary,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
  },
});
