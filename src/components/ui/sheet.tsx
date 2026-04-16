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
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = React.useState(false);

  const translateY = useSharedValue(OFFSCREEN_Y);
  const backdropOpacity = useSharedValue(0);

  const animateOut = React.useCallback(() => {
    translateY.value = withTiming(OFFSCREEN_Y, { duration: tokens.animation.duration.base }, (finished) => {
      if (finished) runOnJS(setIsMounted)(false);
    });
    backdropOpacity.value = withTiming(0, { duration: tokens.animation.duration.fast });
  }, [backdropOpacity, translateY]);

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
      translateY.value = withSpring(0, tokens.animation.spring);
      backdropOpacity.value = withTiming(1, { duration: tokens.animation.duration.fast });
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

  // Bottom padding: respect the home indicator but ensure minimum breathing room
  const bottomPad = Math.max(insets.bottom, tokens.spacing.lg);

  if (!isMounted) return null;

  return (
    <Modal animationType="none" transparent visible={isMounted} onRequestClose={onClose}>
      {/* GestureHandlerRootView required — Modal renders outside the app root tree */}
      <GestureHandlerRootView style={styles.flex}>
        <View style={styles.root}>

          {/* Dim backdrop */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeOnBackdropPress ? onClose : undefined}>
            <Animated.View style={[styles.backdrop, backdropStyle]} />
          </Pressable>

          {/* Sheet panel — plain View so background reaches physical screen bottom */}
          <Animated.View style={[styles.panel, contentStyle, sheetStyle]}>

            {/* Drag handle */}
            <GestureDetector gesture={swipeGesture}>
              <View style={styles.handleArea}>
                <View style={styles.handle} />
              </View>
            </GestureDetector>

            {title ? <Text style={styles.title}>{title}</Text> : null}

            {/* Scrollable body — flex:1 so it yields space to the pinned footer */}
            <ScrollView
              bounces={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>

            {/* Footer pinned outside scroll, always visible */}
            {footer ? (
              <View style={[styles.footer, { paddingBottom: bottomPad }]}>
                {footer}
              </View>
            ) : (
              // Safe-area spacer when there's no footer
              <View style={{ height: bottomPad }} />
            )}

          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.colors.overlay,
  },
  panel: {
    backgroundColor: tokens.colors.background,
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    maxHeight: '88%',
    // Top-edge shadow so the sheet lifts off the content below it
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
    backgroundColor: tokens.colors.border,
  },
  title: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.lg,
    fontWeight: tokens.typography.weights.bold,
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
    borderTopColor: tokens.colors.border,
    gap: tokens.spacing.sm,
  },
});
