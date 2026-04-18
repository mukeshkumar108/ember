import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Button } from './button';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';
import { useReduceMotion } from '@/hooks';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = reduceMotion
        ? withTiming(1, { duration: 0 })
        : withSpring(1, { damping: 18, stiffness: 320, mass: 0.7 });
      opacity.value = withTiming(1, { duration: reduceMotion ? 0 : tokens.animation.duration.fast });
    } else {
      scale.value = withTiming(reduceMotion ? 1 : 0.92, { duration: reduceMotion ? 0 : tokens.animation.duration.fast });
      opacity.value = withTiming(0, { duration: reduceMotion ? 0 : tokens.animation.duration.fast });
    }
  }, [visible, scale, opacity, reduceMotion]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onCancel}
      accessibilityViewIsModal>
      <View style={staticStyles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel}>
          <Animated.View
            style={[staticStyles.backdrop, { backgroundColor: colors.overlay }, backdropStyle]}
          />
        </Pressable>

        <Animated.View
          style={[staticStyles.modal, { backgroundColor: colors.backgroundElevated }, tokens.shadow.lg, panelStyle]}
          accessibilityRole="alert">
          <View style={staticStyles.textContent}>
            <Text style={[staticStyles.title, { color: colors.foreground }]}>{title}</Text>
            <Text style={[staticStyles.message, { color: colors.foregroundSecondary }]}>{message}</Text>
          </View>

          {/* Side-by-side action buttons — matches native iOS alert pattern */}
          <View style={[staticStyles.actions, { borderTopColor: colors.border }]}>
            <View style={staticStyles.actionButton}>
              <Button label={cancelLabel} onPress={onCancel} variant="secondary" />
            </View>
            <View style={staticStyles.actionButton}>
              <Button
                label={confirmLabel}
                onPress={onConfirm}
                variant={destructive ? 'danger' : 'primary'}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const staticStyles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    borderRadius: tokens.radius.xl,
    overflow: 'hidden',
  },
  textContent: {
    padding: tokens.spacing.xl,
    gap: tokens.spacing.sm,
  },
  title: {
    fontFamily: tokens.typography.fonts.bold,
    fontSize: tokens.typography.sizes.lg,
    textAlign: 'center',
  },
  message: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
    lineHeight: tokens.typography.sizes.base * tokens.typography.lineHeights.normal,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    gap: tokens.spacing.sm,
    padding: tokens.spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
