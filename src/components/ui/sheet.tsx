import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';
import { useReduceMotion } from '@/hooks';

const OFFSCREEN_Y = 600;
const DISMISS_THRESHOLD_Y = 120;
const DISMISS_VELOCITY = 800;

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropPress?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Sheet({
  visible,
  onClose,
  title,
  children,
  footer,
  closeOnBackdropPress = true,
  contentStyle,
}: SheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const [isMounted, setIsMounted] = React.useState(false);

  const translateY = useSharedValue(OFFSCREEN_Y);
  const backdropOpacity = useSharedValue(0);

  const animateOut = React.useCallback(() => {
    const duration = reduceMotion ? 0 : tokens.animation.duration.base;
    translateY.value = withTiming(OFFSCREEN_Y, { duration }, (finished) => {
      if (finished) runOnJS(setIsMounted)(false);
    });
    backdropOpacity.value = withTiming(0, { duration: reduceMotion ? 0 : tokens.animation.duration.fast });
  }, [backdropOpacity, translateY, reduceMotion]);

  React.useEffect(() => {
    if (visible) {
      translateY.value = OFFSCREEN_Y;
      setIsMounted(true);
    } else if (isMounted) {
      animateOut();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!isMounted) return;
    const t = setTimeout(() => {
      if (reduceMotion) {
        translateY.value = withTiming(0, { duration: 0 });
      } else {
        translateY.value = withSpring(0, tokens.animation.spring);
      }
      backdropOpacity.value = withTiming(1, { duration: reduceMotion ? 0 : tokens.animation.duration.fast });
    }, 16);
    return () => clearTimeout(t);
  }, [isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const swipeStartY = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .onStart(() => { swipeStartY.value = translateY.value; })
    .onUpdate((e) => {
      if (e.translationY > 0) translateY.value = swipeStartY.value + e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD_Y || e.velocityY > DISMISS_VELOCITY) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, tokens.animation.spring);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));

  const bottomPad = Math.max(insets.bottom, tokens.spacing.lg);

  if (!isMounted) return null;

  return (
    <Modal
      animationType="none"
      transparent
      visible={isMounted}
      onRequestClose={onClose}
      accessibilityViewIsModal>
      <GestureHandlerRootView style={staticStyles.flex}>
        <View style={staticStyles.root}>

          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeOnBackdropPress ? onClose : undefined}>
            <Animated.View style={[staticStyles.backdrop, { backgroundColor: colors.overlay }, backdropStyle]} />
          </Pressable>

          <Animated.View
            style={[
              staticStyles.panel,
              { backgroundColor: colors.backgroundElevated },
              contentStyle,
              sheetStyle,
            ]}>

            <GestureDetector gesture={swipeGesture}>
              <View style={staticStyles.handleArea}>
                <View style={[staticStyles.handle, { backgroundColor: colors.border }]} />
              </View>
            </GestureDetector>

            {title ? (
              <Text style={[staticStyles.title, { color: colors.foreground }]}>{title}</Text>
            ) : null}

            <ScrollView
              bounces={false}
              contentContainerStyle={staticStyles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>

            {footer ? (
              <View style={[staticStyles.footer, { paddingBottom: bottomPad, borderTopColor: colors.border }]}>
                {footer}
              </View>
            ) : (
              <View style={{ height: bottomPad }} />
            )}

          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const staticStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
  },
  handleArea: {
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: tokens.radius.full,
  },
  title: {
    fontFamily: tokens.typography.fonts.bold,
    fontSize: tokens.typography.sizes.lg,
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xs,
    paddingBottom: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  footer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: tokens.spacing.sm,
  },
});
