import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { tokens } from '@/styles/tokens';

type ListItemProps = {
  title: string;
  subtitle?: string;
  /** Left slot — pass an Icon, Avatar, or any element */
  leading?: React.ReactNode;
  /** Right slot — pass a value label, Badge, Toggle, or custom element.
   *  When onPress is set and no trailing is provided, a ChevronRight is shown. */
  trailing?: React.ReactNode;
  /** When set, the row is pressable */
  onPress?: () => void;
  /** Red-tinted title for destructive actions */
  destructive?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  destructive = false,
  disabled = false,
  style,
}: ListItemProps) {
  const showChevron = onPress && trailing === undefined;

  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}

      <View style={styles.textGroup}>
        <Text
          style={[styles.title, destructive ? styles.titleDestructive : null, disabled ? styles.disabled : null]}
          numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, disabled ? styles.disabled : null]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing !== undefined ? (
        <View style={styles.trailing}>{trailing}</View>
      ) : showChevron ? (
        <ChevronRight size={16} color={tokens.colors.muted} strokeWidth={2} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          pressed && !disabled ? styles.pressed : null,
          disabled ? styles.rowDisabled : null,
          style,
        ]}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.row, disabled ? styles.rowDisabled : null, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radius.md,
  },
  leading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.medium,
  },
  titleDestructive: {
    color: tokens.colors.danger,
  },
  subtitle: {
    color: tokens.colors.foregroundSecondary,
    fontSize: tokens.typography.sizes.sm,
  },
  trailing: {
    alignItems: 'flex-end',
  },
  disabled: {
    opacity: 0.45,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: tokens.colors.backgroundSecondary,
  },
});
