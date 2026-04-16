import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui';
import { tokens } from '@/styles/tokens';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button label="Retry" onPress={onRetry} variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
  },
  title: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.lg,
    fontWeight: tokens.typography.weights.bold,
  },
  message: {
    color: tokens.colors.danger,
    fontSize: tokens.typography.sizes.base,
    textAlign: 'center',
  },
});
