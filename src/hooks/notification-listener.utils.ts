type NotificationListenerReadinessInput = {
  isLoaded: boolean;
  isSignedIn: boolean;
  notificationsFeatureEnabled: boolean;
  platform: string;
};

export function shouldStartNotificationListeners({
  isLoaded,
  isSignedIn,
  notificationsFeatureEnabled,
  platform,
}: NotificationListenerReadinessInput) {
  if (!notificationsFeatureEnabled) {
    return false;
  }

  if (!isLoaded || !isSignedIn) {
    return false;
  }

  return platform !== 'web';
}
