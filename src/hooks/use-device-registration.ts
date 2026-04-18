import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { useAuth } from '@clerk/clerk-expo';
import { Platform } from 'react-native';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { registerDeviceRequestSchema, registerDeviceResponseSchema } from '@/api/schemas';
import { parseApiContract } from '@/api/validation';
import { isFeatureEnabled } from '@/features';
import { useApi } from './use-api';

type RegistrationState =
  | 'idle'
  | 'registering'
  | 'registered'
  | 'skipped'
  | 'failed';

export type DeviceRegistrationStatus = {
  state: RegistrationState;
  attempted: boolean;
  supported: boolean;
  hasPushToken: boolean;
  message: string;
  lastAttemptedAt: string | null;
  lastRegisteredAt: string | null;
};

type DeviceRegistrationSnapshot = DeviceRegistrationStatus;

type PersistedRegistration = {
  userId: string;
  platform: 'ios' | 'android' | 'web';
  pushToken: string;
  appVersion?: string;
  lastRegisteredAt: string;
};

const DEVICE_REGISTRATION_CACHE_KEY = 'ember_device_registration_v1';
const REGISTRATION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 12; // 12h

const INITIAL_STATUS: DeviceRegistrationSnapshot = {
  state: 'idle',
  attempted: false,
  supported: true,
  hasPushToken: false,
  message: 'Waiting for authenticated session.',
  lastAttemptedAt: null,
  lastRegisteredAt: null,
};

let snapshot: DeviceRegistrationSnapshot = INITIAL_STATUS;
let inFlightRegistration: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setSnapshot(next: Partial<DeviceRegistrationSnapshot>) {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

async function readRegistrationCache(): Promise<PersistedRegistration | null> {
  try {
    const raw = await SecureStore.getItemAsync(DEVICE_REGISTRATION_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PersistedRegistration;
    if (!parsed.userId || !parsed.pushToken || !parsed.platform || !parsed.lastRegisteredAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function writeRegistrationCache(value: PersistedRegistration) {
  try {
    await SecureStore.setItemAsync(DEVICE_REGISTRATION_CACHE_KEY, JSON.stringify(value));
  } catch {
    // Cache persistence is best-effort only.
  }
}

function getAppVersion(): string | undefined {
  const version = Constants.expoConfig?.version;
  return typeof version === 'string' && version.trim().length > 0 ? version : undefined;
}

function getProjectId(): string | null {
  const easProjectIdFromEasConfig = Constants.easConfig?.projectId;
  if (easProjectIdFromEasConfig) {
    return easProjectIdFromEasConfig;
  }

  const easProjectIdFromExpoConfig = Constants.expoConfig?.extra?.eas?.projectId;
  return typeof easProjectIdFromExpoConfig === 'string' ? easProjectIdFromExpoConfig : null;
}

async function resolvePushToken() {
  if (Platform.OS === 'web') {
    return {
      ok: false as const,
      state: 'skipped' as const,
      message: 'Device registration is skipped on web.',
      supported: false,
      hasPushToken: false,
    };
  }

  if (!Constants.isDevice) {
    return {
      ok: false as const,
      state: 'skipped' as const,
      message: 'Push token unavailable on simulator/Expo Go emulator.',
      supported: false,
      hasPushToken: false,
    };
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  const finalPermissions =
    currentPermissions.status === 'granted'
      ? currentPermissions
      : await Notifications.requestPermissionsAsync();

  if (finalPermissions.status !== 'granted') {
    return {
      ok: false as const,
      state: 'skipped' as const,
      message: 'Push permission not granted.',
      supported: true,
      hasPushToken: false,
    };
  }

  const projectId = getProjectId();
  if (!projectId) {
    return {
      ok: false as const,
      state: 'skipped' as const,
      message: 'Push token unavailable: missing EAS project ID.',
      supported: false,
      hasPushToken: false,
    };
  }

  try {
    const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenResponse.data?.trim();
    if (!token) {
      return {
        ok: false as const,
        state: 'skipped' as const,
        message: 'Push token request returned an empty token.',
        supported: false,
        hasPushToken: false,
      };
    }

    return {
      ok: true as const,
      token,
    };
  } catch {
    return {
      ok: false as const,
      state: 'skipped' as const,
      message: 'Push token unavailable in this environment.',
      supported: false,
      hasPushToken: false,
    };
  }
}

function shouldReuseCachedRegistration(
  cached: PersistedRegistration,
  userId: string,
  platform: 'ios' | 'android' | 'web',
  pushToken: string,
  appVersion?: string,
) {
  if (
    cached.userId !== userId ||
    cached.platform !== platform ||
    cached.pushToken !== pushToken ||
    cached.appVersion !== appVersion
  ) {
    return false;
  }

  const ageMs = Date.now() - new Date(cached.lastRegisteredAt).getTime();
  return ageMs >= 0 && ageMs < REGISTRATION_REFRESH_INTERVAL_MS;
}

function resolvePlatform(): 'ios' | 'android' | 'web' | null {
  if (Platform.OS === 'ios' || Platform.OS === 'android' || Platform.OS === 'web') {
    return Platform.OS;
  }

  return null;
}

export function useDeviceRegistration(options?: { autoRegister?: boolean }) {
  const autoRegister = options?.autoRegister ?? true;
  const notificationsFeatureEnabled = isFeatureEnabled('notifications');
  const { request } = useApi();
  const { isSignedIn, isLoaded, userId } = useAuth();
  const status = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const registerDevice = useCallback(async () => {
    if (!notificationsFeatureEnabled) {
      setSnapshot({
        state: 'skipped',
        attempted: false,
        supported: false,
        hasPushToken: false,
        message: 'Notifications feature is disabled.',
      });
      return;
    }

    if (!isLoaded || !isSignedIn || !userId) {
      setSnapshot({
        state: 'idle',
        attempted: false,
        supported: true,
        hasPushToken: false,
        message: 'Waiting for authenticated session.',
      });
      return;
    }

    if (inFlightRegistration) {
      return inFlightRegistration;
    }

    inFlightRegistration = (async () => {
      const attemptTime = new Date().toISOString();
      setSnapshot({
        state: 'registering',
        attempted: true,
        lastAttemptedAt: attemptTime,
        message: 'Registering device...',
      });

      try {
        const pushTokenResult = await resolvePushToken();
        if (!pushTokenResult.ok) {
          setSnapshot({
            state: pushTokenResult.state,
            supported: pushTokenResult.supported,
            hasPushToken: pushTokenResult.hasPushToken,
            message: pushTokenResult.message,
          });
          return;
        }

        const platform = resolvePlatform();
        if (!platform) {
          setSnapshot({
            state: 'skipped',
            supported: false,
            hasPushToken: false,
            message: 'Device registration is not supported on this platform.',
          });
          return;
        }
        const appVersion = getAppVersion();
        const payload = registerDeviceRequestSchema.parse({
          platform,
          pushToken: pushTokenResult.token,
          appVersion,
        });

        const cachedRegistration = await readRegistrationCache();
        if (
          cachedRegistration &&
          shouldReuseCachedRegistration(
            cachedRegistration,
            userId,
            payload.platform,
            payload.pushToken,
            payload.appVersion,
          )
        ) {
          setSnapshot({
            state: 'registered',
            supported: true,
            hasPushToken: true,
            message: 'Device registration is up to date.',
            lastRegisteredAt: cachedRegistration.lastRegisteredAt,
          });
          return;
        }

        const rawResponse = await request<unknown>('/api/v1/devices', {
          method: 'POST',
          body: payload,
        });
        const response = parseApiContract(
          registerDeviceResponseSchema,
          rawResponse,
          'POST /api/v1/devices response',
        );

        if (!response.success || !response.data) {
          throw new Error(response.error?.message ?? 'Device registration failed');
        }

        await writeRegistrationCache({
          userId,
          platform: payload.platform,
          pushToken: payload.pushToken,
          appVersion: payload.appVersion,
          lastRegisteredAt: response.data.updatedAt,
        });

        setSnapshot({
          state: 'registered',
          supported: true,
          hasPushToken: true,
          message: 'Device registration succeeded.',
          lastRegisteredAt: response.data.updatedAt,
        });
      } catch {
        setSnapshot({
          state: 'failed',
          supported: true,
          hasPushToken: true,
          message: 'Device registration failed. App usage is unaffected.',
        });
      }
    })();

    try {
      await inFlightRegistration;
    } finally {
      inFlightRegistration = null;
    }
  }, [isLoaded, isSignedIn, notificationsFeatureEnabled, request, userId]);

  useEffect(() => {
    if (!isLoaded || isSignedIn) {
      return;
    }

    setSnapshot(INITIAL_STATUS);
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!autoRegister) {
      return;
    }

    void registerDevice();
  }, [autoRegister, registerDevice]);

  return {
    status,
    retryRegistration: registerDevice,
  };
}
