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
import { useTheme } from '@/providers/theme-provider';

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
  const { colors } = useTheme();
  const showChevron = onPress && trailing === undefined;

  const titleColor = destructive ? colors.danger : colors.foreground;

  const content = (
    <>
      {leading ? <View style={staticStyles.leading}>{leading}</View> : null}

      <View style={staticStyles.textGroup}>
        <Text
          style={[
            staticStyles.title,
            { color: titleColor },
            disabled ? staticStyles.disabledText : null,
          ]}
          numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              staticStyles.subtitle,
              { color: colors.foregroundSecondary },
              disabled ? staticStyles.disabledText : null,
            ]}
            numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing !== undefined ? (
        <View style={staticStyles.trailing}>{trailing}</View>
      ) : showChevron ? (
        <ChevronRight size={16} color={colors.muted} strokeWidth={2} />
      ) : null}
    </>
  );

  if (onPress) {
    const a11yLabel = subtitle ? `${title}, ${subtitle}` : title;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          staticStyles.row,
          { backgroundColor: colors.background },
          pressed && !disabled ? { backgroundColor: colors.backgroundSecondary } : null,
          disabled ? staticStyles.rowDisabled : null,
          style,
        ]}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[staticStyles.row, { backgroundColor: colors.background }, disabled ? staticStyles.rowDisabled : null, style]}>
      {content}
    </View>
  );
}

const staticStyles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
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
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.base,
  },
  subtitle: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
  },
  trailing: {
    alignItems: 'flex-end',
  },
  disabledText: {
    opacity: 0.45,
  },
  rowDisabled: {
    opacity: 0.45,
  },
});
