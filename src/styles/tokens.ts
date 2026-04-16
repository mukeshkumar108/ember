/**
 * Design Tokens — Ember UI System
 *
 * Single source of truth for all visual constants. Every component must
 * consume values from this file — no ad-hoc colors, spacing, or sizing.
 *
 * Color system uses iOS semantic naming conventions so the palette reads
 * intuitively when building native-feeling UIs.
 */

export const tokens = {
  colors: {
    // --- Backgrounds ---
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7', // grouped content, cards

    // --- Text ---
    foreground: '#000000',
    foregroundSecondary: '#636366', // secondary labels, metadata
    muted: '#8E8E93', // placeholders, hints, disabled text

    // --- Brand ---
    primary: '#007AFF', // iOS system blue — buttons, links, active states

    // --- Semantic ---
    success: '#34C759', // iOS system green
    warning: '#FF9500', // iOS system orange
    danger: '#FF3B30', // iOS system red

    // --- Chrome ---
    border: '#E5E5EA', // separators, input borders
    overlay: 'rgba(0, 0, 0, 0.40)', // modal/sheet backdrops
  },

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
