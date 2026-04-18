/**
 * Design Tokens — Ember UI System
 *
 * Single source of truth for non-color visual constants (spacing, typography,
 * radius, shadows, animation). Colors live in `src/styles/colors.ts` and are
 * accessed via `useTheme().colors` in components.
 *
 * `tokens.colors` is kept as a light-palette alias for backwards-compatible
 * contexts (tests, SSR, class components). Prefer `useTheme().colors` in all
 * React components so dark mode works correctly.
 */
import { lightColors } from './colors';

export const tokens = {
  /**
   * Backwards-compatible color alias — equals the light palette.
   * Use `useTheme().colors` in components instead of `tokens.colors`.
   */
  colors: lightColors,

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999, // pills, badges, avatars
  },

  typography: {
    sizes: {
      xs: 11, // caption
      sm: 13, // footnote / secondary labels
      base: 16, // body (callout)
      lg: 20, // title 3
      xl: 24, // title 2
      '2xl': 28, // title 1
      '3xl': 34, // large title
    },

    /**
     * Font family names matching the loaded Inter variants.
     * Use these instead of `weights` in stylesheets — the named variant
     * encodes both family and weight, which Android requires.
     */
    fonts: {
      regular: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semibold: 'Inter_600SemiBold',
      bold: 'Inter_700Bold',
    },

    /**
     * Kept for backwards compatibility and system-font fallback contexts.
     * Prefer `fonts.*` in new component styles.
     */
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },

    // Multiply by font size to get lineHeight
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  /**
   * Shadow presets — apply with spread syntax:
   *   style={[styles.container, tokens.shadow.md]}
   */
  shadow: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  },

  animation: {
    duration: {
      fast: 150,
      base: 250,
      slow: 380,
    },
    spring: {
      damping: 22,
      stiffness: 280,
      mass: 0.8,
    },
  },
} as const;
