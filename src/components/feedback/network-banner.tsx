import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '@/hooks';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

export function NetworkBanner() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const network = useNetworkStatus();

  if (!network.hasInitialized || !network.isOffline) {
    return null;
  }

  return (
    <View style={[staticStyles.container, { backgroundColor: colors.warning, paddingTop: insets.top + tokens.spacing.xs }]}>
      <Text style={staticStyles.text}>You are offline. Some actions may fail until connectivity returns.</Text>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.sm,
  },
  text: {
    color: '#FFFFFF', // warning background is always high-contrast; white text passes AA in both themes
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
});
