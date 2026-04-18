import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('feature registry', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.EXPO_PUBLIC_FEATURE_NOTIFICATIONS;
    delete process.env.EXPO_PUBLIC_FEATURE_OFFLINE_AWARENESS;
  });

  it('returns expected default feature flags', async () => {
    const { getFeatureRegistry, isFeatureEnabled } = await import('./registry');

    const registry = getFeatureRegistry();
    expect(Object.keys(registry)).toEqual(
      expect.arrayContaining([
        'notifications',
        'offlineAwareness',
        'analytics',
        'uploads',
        'payments',
        'subscriptions',
        'multiStepOnboarding',
      ]),
    );

    expect(isFeatureEnabled('notifications')).toBe(true);
    expect(isFeatureEnabled('offlineAwareness')).toBe(true);
    expect(isFeatureEnabled('analytics')).toBe(false);
  });

  it('supports env toggle overrides', async () => {
    process.env.EXPO_PUBLIC_FEATURE_NOTIFICATIONS = 'false';
    process.env.EXPO_PUBLIC_FEATURE_OFFLINE_AWARENESS = '0';

    const { isFeatureEnabled } = await import('./registry');
    expect(isFeatureEnabled('notifications')).toBe(false);
    expect(isFeatureEnabled('offlineAwareness')).toBe(false);
  });
});
