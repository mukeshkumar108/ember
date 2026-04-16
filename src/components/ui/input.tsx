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

type InputProps = TextInputProps & {
  label?: string;
  error?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ label, error, containerStyle, style, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={tokens.colors.muted}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
    fontWeight: tokens.typography.weights.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.muted,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    fontSize: tokens.typography.sizes.base,
    color: tokens.colors.foreground,
    backgroundColor: tokens.colors.background,
  },
  inputError: {
    borderColor: tokens.colors.danger,
  },
  error: {
    color: tokens.colors.danger,
    fontSize: tokens.typography.sizes.sm,
  },
});
