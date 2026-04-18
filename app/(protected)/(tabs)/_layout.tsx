import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Compass, Home, Settings } from 'lucide-react-native';
import { HapticTab } from '@/components/ui/haptic-tab';
import { useTheme } from '@/providers/theme-provider';
import { tokens } from '@/styles/tokens';

const TAB_ICON_SIZE = 24;
const TAB_ICON_STROKE = 1.75;

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: staticStyles.label,
        tabBarStyle: Platform.select({
          ios: {
            // Transparent so the native blur shows through on iOS
            position: 'absolute',
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
          },
          default: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
            elevation: 0,
          },
        }),
        tabBarBackground: Platform.OS !== 'ios'
          ? () => <View style={StyleSheet.absoluteFill} />
          : undefined,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={TAB_ICON_SIZE}
              color={color}
              strokeWidth={focused ? 2.25 : TAB_ICON_STROKE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Compass
              size={TAB_ICON_SIZE}
              color={color}
              strokeWidth={focused ? 2.25 : TAB_ICON_STROKE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Settings
              size={TAB_ICON_SIZE}
              color={color}
              strokeWidth={focused ? 2.25 : TAB_ICON_STROKE}
            />
          ),
        }}
      />
      {/* Internal routes — hidden from tab bar */}
      <Tabs.Screen name="playground" options={{ href: null }} />
      <Tabs.Screen name="playground-form" options={{ href: null }} />
    </Tabs>
  );
}

const staticStyles = StyleSheet.create({
  label: {
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.xs,
    letterSpacing: 0.2,
  },
});
