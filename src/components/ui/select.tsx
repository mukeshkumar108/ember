import React from 'react';
import {
  ActionSheetIOS,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Sheet } from './sheet';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  error?: string | null;
  hint?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Select({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onValueChange,
  error,
  hint,
  disabled = false,
  containerStyle,
}: SelectProps) {
  const { colors } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const selectedOption = options.find((o) => o.value === value);
  const selectedLabel = selectedOption?.label ?? '';

  const accessibleLabel = label
    ? `${label}, ${selectedLabel || placeholder}`
    : selectedLabel || placeholder;

  const handleOpen = () => {
    if (disabled) return;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...options.map((o) => o.label)],
          cancelButtonIndex: 0,
          title: label,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) return;
          onValueChange(options[buttonIndex - 1].value);
        },
      );
    } else {
      setIsSheetOpen(true);
    }
  };

  const borderColor = error ? colors.danger : colors.border;

  return (
    <View style={[staticStyles.container, containerStyle]}>
      {label ? (
        <Text
          style={[staticStyles.label, { color: colors.foreground }]}
          accessibilityElementsHidden
          importantForAccessibility="no">
          {label}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={accessibleLabel}
        accessibilityState={{ disabled, expanded: isSheetOpen }}
        accessibilityValue={{ text: selectedLabel || placeholder }}
        disabled={disabled}
        onPress={handleOpen}
        style={({ pressed }) => [
          staticStyles.trigger,
          { borderColor, backgroundColor: colors.background },
          disabled ? staticStyles.disabled : null,
          pressed && !disabled ? staticStyles.pressed : null,
        ]}>
        <Text
          style={[
            staticStyles.valueText,
            { color: selectedLabel ? colors.foreground : colors.muted },
          ]}
          numberOfLines={1}>
          {selectedLabel || placeholder}
        </Text>
        <ChevronDown size={16} color={colors.muted} strokeWidth={2} />
      </Pressable>

      {error ? (
        <Text style={[staticStyles.helperText, { color: colors.danger }]} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      {hint && !error ? (
        <Text style={[staticStyles.helperText, { color: colors.muted }]}>{hint}</Text>
      ) : null}

      {/* Android-only sheet picker */}
      {Platform.OS !== 'ios' ? (
        <Sheet
          visible={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title={label ?? 'Select an option'}>
          <View style={staticStyles.optionList}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={isSelected ? `${option.label}, selected` : option.label}
                  onPress={() => {
                    onValueChange(option.value);
                    setIsSheetOpen(false);
                  }}
                  style={({ pressed }) => [
                    staticStyles.optionButton,
                    isSelected ? { backgroundColor: `${colors.primary}14` } : null,
                    pressed ? staticStyles.pressed : null,
                  ]}>
                  <Text
                    style={[
                      staticStyles.optionText,
                      { color: isSelected ? colors.primary : colors.foreground },
                      isSelected ? staticStyles.optionTextSelected : null,
                    ]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Sheet>
      ) : null}
    </View>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    gap: tokens.spacing.xs,
  },
  label: {
    fontFamily: tokens.typography.fonts.semibold,
    fontSize: tokens.typography.sizes.sm,
  },
  trigger: {
    minHeight: 50,
    borderWidth: 1.5,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  valueText: {
    flex: 1,
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
  },
  helperText: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.7,
  },
  optionList: {
    gap: tokens.spacing.xs,
  },
  optionButton: {
    minHeight: 50,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.lg,
    justifyContent: 'center',
  },
  optionText: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
  },
  optionTextSelected: {
    fontFamily: tokens.typography.fonts.semibold,
  },
});
