import React from 'react';
import type { LucideIcon } from 'lucide-react-native';
import { tokens } from '@/styles/tokens';

export type IconProps = {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/**
 * Thin wrapper around lucide-react-native icons.
 *
 * Usage:
 *   import { Settings } from 'lucide-react-native';
 *   <Icon icon={Settings} size={20} color={tokens.colors.muted} />
 */
export function Icon({
  icon: LucideIconComponent,
  size = 24,
  color = tokens.colors.foreground,
  strokeWidth = 1.75,
}: IconProps) {
  return <LucideIconComponent size={size} color={color} strokeWidth={strokeWidth} />;
}
