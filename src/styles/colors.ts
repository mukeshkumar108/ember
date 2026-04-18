/**
 * Ember Color Palettes
 *
 * Both palettes share the same shape — swap them at the theme boundary.
 * Use `useTheme().colors` in components instead of importing these directly.
 *
 * Naming follows iOS semantic label conventions so the intent is always clear:
 *   background / backgroundSecondary / backgroundElevated  — surface hierarchy
 *   foreground / foregroundSecondary / muted               — text hierarchy
 *   primary / success / warning / danger                   — semantic signals
 *   border / overlay                                        — chrome
 */

export type Colors = typeof lightColors;

export const lightColors = {
  // ── Surfaces ──────────────────────────────────────────────────────────────
  /** Primary app background (white) */
  background: '#FFFFFF',
  /** Grouped content, default cards, table backgrounds */
  backgroundSecondary: '#F2F2F7',
  /** Elevated surfaces: sheets, modals, elevated cards */
  backgroundElevated: '#FFFFFF',

  // ── Text ──────────────────────────────────────────────────────────────────
  /** Primary labels and body copy */
  foreground: '#000000',
  /** Secondary labels, metadata, subtitles */
  foregroundSecondary: '#636366',
  /** Placeholders, hints, captions, disabled text */
  muted: '#8E8E93',

  // ── Brand ─────────────────────────────────────────────────────────────────
  /** Interactive blue — buttons, links, active states */
  primary: '#007AFF',

  // ── Semantic ──────────────────────────────────────────────────────────────
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',

  // ── Chrome ────────────────────────────────────────────────────────────────
  /** Separators, input borders */
  border: '#E5E5EA',
  /** Modal/sheet backdrops */
  overlay: 'rgba(0,0,0,0.40)',
} as const;

export const darkColors = {
  // ── Surfaces ──────────────────────────────────────────────────────────────
  /** OLED-friendly true black — matches iOS system background dark */
  background: '#000000',
  /** Grouped/secondary surfaces — iOS grouped secondary dark */
  backgroundSecondary: '#1C1C1E',
  /** Elevated surfaces: sheets, modals, cards lifted off background */
  backgroundElevated: '#2C2C2E',

  // ── Text ──────────────────────────────────────────────────────────────────
  foreground: '#FFFFFF',
  foregroundSecondary: '#AEAEB2',
  muted: '#6E6E73',

  // ── Brand ─────────────────────────────────────────────────────────────────
  /** iOS system blue — dark variant has slightly higher luminance */
  primary: '#0A84FF',

  // ── Semantic ──────────────────────────────────────────────────────────────
  success: '#30D158',
  warning: '#FF9F0A',
  danger: '#FF453A',

  // ── Chrome ────────────────────────────────────────────────────────────────
  border: '#38383A',
  overlay: 'rgba(0,0,0,0.60)',
} as const;
