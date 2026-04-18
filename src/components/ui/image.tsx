import React from 'react';
import { Image as ExpoImage, type ImageProps as ExpoImageProps } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/providers/theme-provider';
import { tokens } from '@/styles/tokens';

const DEFAULT_BLURHASH = 'L4JHj1~q00^+_3D*4n9Y00Rj?bt7';

type AppImageProps = Omit<ExpoImageProps, 'source'> & {
  uri?: string | null;
  source?: ExpoImageProps['source'];
  blurhash?: string;
  fallbackText?: string;
  fallbackContainerStyle?: StyleProp<ViewStyle>;
};

export function Image({
  uri,
  source,
  blurhash,
  fallbackText = 'Image unavailable',
  fallbackContainerStyle,
  contentFit = 'cover',
  transition = 180,
  ...props
}: AppImageProps) {
  const { colors } = useTheme();
  const [hasError, setHasError] = React.useState(false);

  const resolvedSource = source ?? (uri ? { uri } : null);
  const shouldRenderFallback = !resolvedSource || hasError;

  if (shouldRenderFallback) {
    return (
      <View
        style={[
          staticStyles.fallbackContainer,
          { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
          fallbackContainerStyle,
        ]}>
        <Text style={[staticStyles.fallbackText, { color: colors.muted }]}>{fallbackText}</Text>
      </View>
    );
  }

  return (
    <ExpoImage
      source={resolvedSource}
      placeholder={blurhash ?? DEFAULT_BLURHASH}
      onError={() => setHasError(true)}
      contentFit={contentFit}
      transition={transition}
      {...props}
    />
  );
}

const staticStyles = StyleSheet.create({
  fallbackContainer: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
  },
  fallbackText: {
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
});
