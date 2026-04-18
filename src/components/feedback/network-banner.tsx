import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '@/hooks';
import { tokens } from '@/styles/tokens';

export function NetworkBanner() {
  const insets = useSafeAreaInsets();
  const network = useNetworkStatus();

  if (!network.hasInitialized || !network.isOffline) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + tokens.spacing.xs }]}>
      <Text style={styles.text}>You are offline. Some actions may fail until connectivity returns.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.warning,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.sm,
  },
  text: {
    color: tokens.colors.background,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
    textAlign: 'center',
  },
});
