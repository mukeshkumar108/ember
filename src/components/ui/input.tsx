import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string | null;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ label, error, hint, containerStyle, style, onFocus, onBlur, ...props }: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const borderColor = error ? colors.danger : isFocused ? colors.primary : colors.border;

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
      <TextInput
        placeholderTextColor={colors.muted}
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityValue={error ? { text: error } : undefined}
        accessibilityInvalid={!!error}
        style={[
          staticStyles.input,
          { borderColor, color: colors.foreground, backgroundColor: colors.background },
          style,
        ]}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {error ? (
        <Text style={[staticStyles.helperText, { color: colors.danger }]} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      {hint && !error ? (
        <Text style={[staticStyles.helperText, { color: colors.muted }]}>{hint}</Text>
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
  input: {
    minHeight: 50,
    borderWidth: 1.5,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.base,
  },
  helperText: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
  },
});
