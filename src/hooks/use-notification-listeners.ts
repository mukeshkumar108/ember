import { useAuth } from '@clerk/clerk-expo';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { getNotificationEventHandlers, isFeatureEnabled } from '@/features';
import { shouldStartNotificationListeners } from './notification-listener.utils';

export function useNotificationListeners() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (
      !shouldStartNotificationListeners({
        isLoaded,
        isSignedIn: !!isSignedIn,
        notificationsFeatureEnabled: isFeatureEnabled('notifications'),
        platform: Platform.OS,
      })
    ) {
      return;
    }

    try {
      const foregroundSub = Notifications.addNotificationReceivedListener((notification) => {
        getNotificationEventHandlers().onForegroundNotification?.(notification);
      });

      const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
        getNotificationEventHandlers().onNotificationResponse?.(response);
      });

      return () => {
        foregroundSub.remove();
        responseSub.remove();
      };
    } catch {
      // Listener setup is best-effort and non-blocking in the starter baseline.
      return;
    }
  }, [isLoaded, isSignedIn]);
}
