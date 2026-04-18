import React from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

type AvatarProps = {
  /** Display name — used to generate initials and pick a background color */
  name?: string;
  /** URI for a remote or local image — shown instead of initials when provided */
  imageUri?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
};

const AVATAR_COLORS = [
  '#007AFF', // blue
  '#34C759', // green
  '#FF9500', // orange
  '#AF52DE', // purple
  '#FF3B30', // red
  '#5AC8FA', // teal
  '#FF2D55', // pink
  '#FFCC00', // yellow
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 28,
  md: 40,
  lg: 52,
  xl: 72,
};

const FONT_SIZE_MAP: Record<AvatarSize, number> = {
  sm: tokens.typography.sizes.xs,
  md: tokens.typography.sizes.sm,
  lg: tokens.typography.sizes.base,
  xl: tokens.typography.sizes.lg,
};

export function Avatar({ name = '', imageUri, size = 'md', style }: AvatarProps) {
  const { colors } = useTheme();
  const diameter = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];
  // Named avatars get a deterministic color; unnamed fallback uses the themed surface
  const bgColor = name ? getAvatarColor(name) : colors.backgroundSecondary;
  const initials = name ? getInitials(name) : '?';

  const containerStyle = [
    staticStyles.base,
    { width: diameter, height: diameter, borderRadius: diameter / 2, backgroundColor: bgColor },
    style,
  ];

  if (imageUri) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: imageUri }}
          style={[staticStyles.image, { borderRadius: diameter / 2 }]}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={[staticStyles.initials, { fontSize, fontFamily: tokens.typography.fonts.semibold }]}>
        {initials}
      </Text>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#FFFFFF', // white text always — avatar background colors are all vibrant
  },
});
