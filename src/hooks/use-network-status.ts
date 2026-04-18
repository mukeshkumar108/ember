import NetInfo from '@react-native-community/netinfo';
import { useEffect, useSyncExternalStore } from 'react';
import { isFeatureEnabled } from '@/features';
import { mapNetInfoStateToNetworkStatus } from './network-status.utils';

export type NetworkStatus = {
  hasInitialized: boolean;
  isConnected: boolean;
  isInternetReachable: boolean | null;
  isOffline: boolean;
};

const INITIAL_NETWORK_STATUS: NetworkStatus = {
  hasInitialized: false,
  isConnected: true,
  isInternetReachable: null,
  isOffline: false,
};

let snapshot: NetworkStatus = INITIAL_NETWORK_STATUS;
let stopMonitoring: (() => void) | null = null;
const listeners = new Set<() => void>();

function emit(next: Partial<NetworkStatus>) {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function ensureMonitoring() {
  if (stopMonitoring || !isFeatureEnabled('offlineAwareness')) {
    return;
  }

  stopMonitoring = NetInfo.addEventListener((state) => {
    emit(mapNetInfoStateToNetworkStatus(state));
  });

  void NetInfo.fetch().then((state) => {
    emit(mapNetInfoStateToNetworkStatus(state));
  });
}

export function useNetworkStatus() {
  useEffect(() => {
    ensureMonitoring();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
