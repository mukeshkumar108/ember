import React from 'react';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/providers/theme-provider';

export type IconProps = {
  icon: LucideIcon;
  size?: number;
  /** Defaults to the theme foreground color when omitted */
  color?: string;
  strokeWidth?: number;
};

/**
 * Thin wrapper around lucide-react-native icons.
 *
 * Usage:
 *   import { Settings } from 'lucide-react-native';
 *   <Icon icon={Settings} size={20} />
 *   <Icon icon={Settings} size={20} color={colors.muted} />
 */
export function Icon({
  icon: LucideIconComponent,
  size = 24,
  color,
  strokeWidth = 1.75,
}: IconProps) {
  const { colors } = useTheme();
  return (
    <LucideIconComponent
      size={size}
      color={color ?? colors.foreground}
      strokeWidth={strokeWidth}
    />
  );
}
