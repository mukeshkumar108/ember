import { describe, expect, it } from 'vitest';
import { shouldStartNotificationListeners } from './notification-listener.utils';

describe('shouldStartNotificationListeners', () => {
  it('returns false when feature is disabled', () => {
    expect(
      shouldStartNotificationListeners({
        isLoaded: true,
        isSignedIn: true,
        notificationsFeatureEnabled: false,
        platform: 'ios',
      }),
    ).toBe(false);
  });

  it('returns false when auth is not ready', () => {
    expect(
      shouldStartNotificationListeners({
        isLoaded: false,
        isSignedIn: true,
        notificationsFeatureEnabled: true,
        platform: 'ios',
      }),
    ).toBe(false);
  });

  it('returns false on web baseline', () => {
    expect(
      shouldStartNotificationListeners({
        isLoaded: true,
        isSignedIn: true,
        notificationsFeatureEnabled: true,
        platform: 'web',
      }),
    ).toBe(false);
  });

  it('returns true when authenticated and supported', () => {
    expect(
      shouldStartNotificationListeners({
        isLoaded: true,
        isSignedIn: true,
        notificationsFeatureEnabled: true,
        platform: 'android',
      }),
    ).toBe(true);
  });
});
