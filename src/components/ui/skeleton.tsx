import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

type SkeletonShape = 'rect' | 'circle' | 'text';

type SkeletonProps = {
  /** 'rect' for boxes/images, 'circle' for avatars, 'text' for inline text placeholders */
  shape?: SkeletonShape;
  width?: number | `${number}%`;
  height?: number;
  /** Diameter when shape='circle' */
  diameter?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({
  shape = 'rect',
  width,
  height = 16,
  diameter = 40,
  borderRadius,
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: tokens.animation.duration.slow }),
        withTiming(1, { duration: tokens.animation.duration.slow }),
      ),
      -1, // infinite
      false,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (shape === 'circle') {
    return (
      <Animated.View
        style={[
          staticStyles.base,
          { width: diameter, height: diameter, borderRadius: diameter / 2, backgroundColor: colors.backgroundSecondary },
          animatedStyle,
          style,
        ]}
      />
    );
  }

  if (shape === 'text') {
    return (
      <Animated.View
        style={[
          staticStyles.base,
          staticStyles.textShape,
          { backgroundColor: colors.backgroundSecondary },
          width ? { width } : null,
          animatedStyle,
          style,
        ]}
      />
    );
  }

  return (
    <Animated.View
      style={[
        staticStyles.base,
        {
          width: width ?? '100%',
          height,
          borderRadius: borderRadius ?? tokens.radius.md,
          backgroundColor: colors.backgroundSecondary,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/**
 * Convenience component: a row of Skeleton pieces for a typical list item.
 */
export function SkeletonListItem({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[staticStyles.listItem, style]}>
      <Skeleton shape="circle" diameter={40} />
      <View style={staticStyles.listItemText}>
        <Skeleton shape="text" width="60%" height={14} />
        <Skeleton shape="text" width="40%" height={12} />
      </View>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  base: {},
  textShape: {
    height: 14,
    borderRadius: tokens.radius.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  listItemText: {
    flex: 1,
    gap: tokens.spacing.sm,
  },
});
