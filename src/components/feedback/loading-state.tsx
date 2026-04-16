import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/styles/tokens';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={tokens.colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.md,
    minHeight: 120,
    padding: tokens.spacing.lg,
  },
  message: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.base,
  },
});
