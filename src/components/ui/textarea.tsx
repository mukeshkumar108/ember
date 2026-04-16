import React from 'react';
import { StyleSheet } from 'react-native';
import { Input, type InputProps } from './input';
import { tokens } from '@/styles/tokens';

type TextAreaProps = Omit<InputProps, 'multiline'> & {
  minHeight?: number;
};

export function TextArea({ minHeight = 120, style, ...props }: TextAreaProps) {
  return (
    <Input
      multiline
      style={[styles.textArea, { minHeight }, style]}
      textAlignVertical="top"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textArea: {
    paddingTop: tokens.spacing.md,
    lineHeight: tokens.typography.sizes.base * tokens.typography.lineHeights.normal,
  },
});
