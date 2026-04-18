import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

type ScreenProps = {
  children: React.ReactNode;
  /** Large title shown at the top of the screen, Apple Large Title style */
  header?: string;
  scroll?: boolean;
  /** Wraps in KeyboardAvoidingView — use when screen contains any TextInput */
  keyboardAware?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
};

export function Screen({
  children,
  header,
  scroll = false,
  keyboardAware = false,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
}: ScreenProps) {
  const { colors } = useTheme();

  const body = scroll ? (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[staticStyles.content, contentContainerStyle]}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={false}>
      {header ? (
        <Text style={[staticStyles.pageTitle, { color: colors.foreground }]}>{header}</Text>
      ) : null}
      {children}
    </ScrollView>
  ) : (
    <View style={[staticStyles.content, contentContainerStyle]}>
      {header ? (
        <Text style={[staticStyles.pageTitle, { color: colors.foreground }]}>{header}</Text>
      ) : null}
      {children}
    </View>
  );

  const inner = keyboardAware ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={staticStyles.flex}>
      {body}
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return (
    <SafeAreaView style={[staticStyles.safeArea, { backgroundColor: colors.background }, style]}>
      {inner}
    </SafeAreaView>
  );
}

const staticStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.xl,
    gap: tokens.spacing.xl,
  },
  pageTitle: {
    fontFamily: tokens.typography.fonts.bold,
    fontSize: tokens.typography.sizes['2xl'],
    letterSpacing: 0.35,
    marginBottom: tokens.spacing.sm,
  },
});
