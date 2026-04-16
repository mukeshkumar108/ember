export const tokens = {
  colors: {
    background: '#FFFFFF',
    foreground: '#111111',
    muted: '#6B7280',
    primary: '#1F2937',
    danger: '#DC2626',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  typography: {
    sizes: {
      sm: 14,
      base: 16,
      lg: 18,
      xl: 24,
      '2xl': 30,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
    },
  },
} as const;
