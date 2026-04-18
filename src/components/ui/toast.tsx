import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';
import { useReduceMotion } from '@/hooks';

type ToastType = 'info' | 'success' | 'error' | 'warning';

type ToastPayload = {
  message: string;
  type?: ToastType;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastItem = Required<Pick<ToastPayload, 'message' | 'type' | 'durationMs'>> &
  Pick<ToastPayload, 'actionLabel' | 'onAction'>;

type ToastContextValue = {
  showToast: (payload: ToastPayload) => void;
  hideToast: () => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const [toast, setToast] = React.useState<ToastItem | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const hideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Starts off-screen below (positive Y moves down on screen)
  const translateY = useSharedValue(80);
  const opacity = useSharedValue(0);

  const clearHideTimer = React.useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const animateOut = React.useCallback(() => {
    const hide = () => {
      setIsVisible(false);
      setToast(null);
    };
    const dur = reduceMotion ? 0 : tokens.animation.duration.fast;
    translateY.value = withTiming(80, { duration: dur }, (finished) => {
      if (finished) runOnJS(hide)();
    });
    opacity.value = withTiming(0, { duration: dur });
  }, [opacity, translateY, reduceMotion]);

  const hideToast = React.useCallback(() => {
    clearHideTimer();
    animateOut();
  }, [animateOut, clearHideTimer]);

  const showToast = React.useCallback(
    (payload: ToastPayload) => {
      clearHideTimer();
      translateY.value = 80;
      opacity.value = 0;

      setToast({
        message: payload.message,
        type: payload.type ?? 'info',
        durationMs: payload.durationMs ?? 3000,
        actionLabel: payload.actionLabel,
        onAction: payload.onAction,
      });
      setIsVisible(true);

      // Kick off entry animation on next frame
      setTimeout(() => {
        if (reduceMotion) {
          translateY.value = withTiming(0, { duration: 0 });
        } else {
          translateY.value = withSpring(0, { damping: 20, stiffness: 300, mass: 0.7 });
        }
        opacity.value = withTiming(1, { duration: reduceMotion ? 0 : tokens.animation.duration.fast });
      }, 16);

      hideTimeoutRef.current = setTimeout(() => {
        animateOut();
      }, payload.durationMs ?? 3000);
    },
    [animateOut, clearHideTimer, opacity, reduceMotion, translateY],
  );

  React.useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Toast backgrounds are always high-contrast regardless of theme.
  // info uses a near-black in light mode, elevated gray in dark mode.
  const toastTypeStyle: Record<ToastType, StyleProp<ViewStyle>> = {
    info: { backgroundColor: isDark ? '#48484A' : '#1C1C1E' },
    success: { backgroundColor: '#1A7A32' }, // dark green — WCAG AA with white text in both modes
    error: { backgroundColor: '#D70015' },   // darkened danger — WCAG AA with white text
    warning: { backgroundColor: '#7A4A00' }, // dark amber — WCAG AA with white text in both modes
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {isVisible && toast ? (
        <View pointerEvents="box-none" style={staticStyles.viewport}>
          <Animated.View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={[
              staticStyles.toast,
              toastTypeStyle[toast.type],
              tokens.shadow.lg,
              { marginBottom: insets.bottom + tokens.spacing.lg },
              animatedStyle,
            ]}>
            <Text style={staticStyles.message} numberOfLines={2}>{toast.message}</Text>
            {toast.actionLabel && toast.onAction ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  toast.onAction?.();
                  hideToast();
                }}>
                <Text style={staticStyles.action}>{toast.actionLabel}</Text>
              </Pressable>
            ) : (
              <Pressable accessibilityRole="button" onPress={hideToast}>
                <Text style={staticStyles.action}>Dismiss</Text>
              </Pressable>
            )}
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const staticStyles = StyleSheet.create({
  viewport: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: tokens.spacing.lg,
    pointerEvents: 'box-none',
  },
  toast: {
    minHeight: 52,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
  },
  // All toast types use white text — backgrounds are all dark/high-contrast
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: tokens.typography.sizes.sm * tokens.typography.lineHeights.relaxed,
  },
  action: {
    color: '#FFFFFF',
    fontFamily: tokens.typography.fonts.bold,
    fontSize: tokens.typography.sizes.sm,
    opacity: 0.9,
  },
});
