import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

type LoadingStateProps = {
  message?: string;
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function LoadingState({ message = 'Loading...', fullScreen = false, style }: LoadingStateProps) {
  const { colors } = useTheme();
  return (
    <View style={[staticStyles.container, fullScreen ? staticStyles.fullScreen : null, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? (
        <Text style={[staticStyles.message, { color: colors.muted }]}>{message}</Text>
      ) : null}
    </View>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.md,
    minHeight: 120,
    padding: tokens.spacing.xl,
  },
  message: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  fullScreen: {
    flex: 1,
  },
});
