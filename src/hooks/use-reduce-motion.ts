import React from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Returns true when the user has enabled "Reduce Motion" in system accessibility settings.
 *
 * Wire this to any spring/bounce animation and fall back to a simple fade or
 * instant transition. Apple requires apps to respect this setting.
 *
 *   const reduceMotion = useReduceMotion();
 *   translateY.value = reduceMotion
 *     ? withTiming(0, { duration: 0 })
 *     : withSpring(0, tokens.animation.spring);
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  return reduceMotion;
}
