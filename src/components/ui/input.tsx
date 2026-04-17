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

export type InputProps = TextInputProps & {
  label?: string;
  error?: string | null;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ label, error, hint, containerStyle, style, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        // Hidden from accessibility tree — the label is surfaced via
        // accessibilityLabel on the TextInput directly
        <Text style={styles.label} accessibilityElementsHidden importantForAccessibility="no">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={tokens.colors.muted}
        // Surface the label as the accessible name so VoiceOver announces
        // "Email, text field" rather than just "text field"
        accessibilityLabel={label}
        accessibilityHint={hint}
        // Announce error to VoiceOver when present
        accessibilityValue={error ? { text: error } : undefined}
        accessibilityInvalid={!!error}
        style={[
          styles.input,
          isFocused ? styles.inputFocused : null,
          error ? styles.inputError : null,
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
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
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
  input: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    fontSize: tokens.typography.sizes.base,
    color: tokens.colors.foreground,
    backgroundColor: tokens.colors.background,
  },
  inputFocused: {
    borderColor: tokens.colors.primary,
  },
  inputError: {
    borderColor: tokens.colors.danger,
  },
  error: {
    color: tokens.colors.danger,
    fontSize: tokens.typography.sizes.sm,
  },
  hint: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
  },
});
