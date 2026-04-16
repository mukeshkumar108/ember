import React from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '@/styles/tokens';

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
};

export function Screen({
  children,
  scroll = false,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
}: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, style]}>
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={[styles.content, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.xl,
    gap: tokens.spacing.lg,
  },
});
