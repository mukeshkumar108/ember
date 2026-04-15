import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';

/**
 * Placeholder hook for device registration.
 * Used for push notification tokens or device-specific analytics.
 */
export function useDeviceRegistration() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // TODO: Implement device registration logic.
      // 1. Request push notification permissions.
      // 2. Fetch unique device identifier and/or push token.
      // 3. Register device with forgingfire via POST /api/v1/devices.
      
      // No-op for now; this hook reserves bootstrap space for future device sync.
    }
  }, [isLoaded, isSignedIn]);
}
