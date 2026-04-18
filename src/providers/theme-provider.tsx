import React from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type Colors } from '@/styles/colors';

type ThemeContextValue = {
  colors: Colors;
  isDark: boolean;
};

const ThemeContext = React.createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
});

/**
 * Provides the current color palette to all descendant components.
 * Responds to system color scheme changes automatically.
 *
 * Must be inside AppProviders (already wired in src/providers/index.tsx).
 * Consume via `useTheme()`.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  // Memoize so descendants only re-render when the theme actually changes
  const value = React.useMemo<ThemeContextValue>(() => ({ colors, isDark }), [colors, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Returns the current theme colors and isDark flag.
 *
 * Usage:
 *   const { colors, isDark } = useTheme();
 *   style={{ backgroundColor: colors.background, color: colors.foreground }}
 */
export function useTheme(): ThemeContextValue {
  return React.useContext(ThemeContext);
}
