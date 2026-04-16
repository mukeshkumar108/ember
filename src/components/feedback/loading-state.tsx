import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';

type LoadingStateProps = {
  message?: string;
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function LoadingState({ message = 'Loading...', fullScreen = false, style }: LoadingStateProps) {
  return (
    <View style={[styles.container, fullScreen ? styles.fullScreen : null, style]}>
      <ActivityIndicator size="large" color={tokens.colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.md,
    minHeight: 120,
    padding: tokens.spacing.xl,
  },
  message: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  fullScreen: {
    flex: 1,
  },
});
