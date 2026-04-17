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
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const selectedOption = options.find((o) => o.value === value);
  const selectedLabel = selectedOption?.label ?? '';

  // Compose a full accessible label: "Locale, English (US)" or "Locale, Select an option"
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

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label} accessibilityElementsHidden importantForAccessibility="no">
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
          styles.trigger,
          error ? styles.triggerError : null,
          disabled ? styles.disabled : null,
          pressed && !disabled ? styles.pressed : null,
        ]}>
        <Text style={selectedLabel ? styles.valueText : styles.placeholderText} numberOfLines={1}>
          {selectedLabel || placeholder}
        </Text>
        <ChevronDown size={16} color={tokens.colors.muted} strokeWidth={2} />
      </Pressable>

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}

      {/* Android-only sheet picker */}
      {Platform.OS !== 'ios' ? (
        <Sheet
          visible={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title={label ?? 'Select an option'}>
          <View style={styles.optionList}>
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
                    styles.optionButton,
                    isSelected ? styles.optionSelected : null,
                    pressed ? styles.pressed : null,
                  ]}>
                  <Text style={[styles.optionText, isSelected ? styles.optionTextSelected : null]}>
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

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.xs,
  },
  label: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
  },
  trigger: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  triggerError: {
    borderColor: tokens.colors.danger,
  },
  valueText: {
    flex: 1,
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
  },
  placeholderText: {
    flex: 1,
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.base,
  },
  error: {
    color: tokens.colors.danger,
    fontSize: tokens.typography.sizes.sm,
  },
  hint: {
    color: tokens.colors.muted,
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
  optionSelected: {
    backgroundColor: `${tokens.colors.primary}14`,
  },
  optionText: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
  },
  optionTextSelected: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.weights.semibold,
  },
});
