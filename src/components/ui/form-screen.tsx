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

type FormScreenProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  keyboardVerticalOffset?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
};

/**
 * Standard container for input-heavy screens (auth, settings, profile forms).
 *
 * Handles keyboard avoidance, safe-area edges, and a consistent header/footer
 * layout so individual screens stay thin. Always prefer FormScreen over Screen
 * whenever the screen has TextInput fields.
 */
export function FormScreen({
  title,
  subtitle,
  children,
  footer,
  keyboardVerticalOffset = 0,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
}: FormScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.keyboardRoot}>
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          showsVerticalScrollIndicator={false}>
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            <View style={styles.form}>{children}</View>
          </View>

          {footer ? (
            <SafeAreaView edges={['bottom']} style={styles.footer}>
              {footer}
            </SafeAreaView>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  keyboardRoot: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing.sm,
    gap: tokens.spacing.xl,
  },
  main: {
    flexGrow: 1,
    gap: tokens.spacing.xl,
  },
  header: {
    gap: tokens.spacing.sm,
  },
  title: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes['2xl'],
    fontWeight: tokens.typography.weights.bold,
    letterSpacing: 0.35,
  },
  subtitle: {
    color: tokens.colors.foregroundSecondary,
    fontSize: tokens.typography.sizes.base,
    lineHeight: tokens.typography.sizes.base * tokens.typography.lineHeights.relaxed,
  },
  form: {
    gap: tokens.spacing.md,
  },
  footer: {
    marginTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    alignItems: 'center',
  },
});
