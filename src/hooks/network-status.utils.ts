import type { NetInfoState } from '@react-native-community/netinfo';
import type { NetworkStatus } from './use-network-status';

export function mapNetInfoStateToNetworkStatus(state: NetInfoState): NetworkStatus {
  const isConnected = state.isConnected ?? false;
  const isInternetReachable = state.isInternetReachable;
  const isOffline = !isConnected || isInternetReachable === false;

  return {
    hasInitialized: true,
    isConnected,
    isInternetReachable,
    isOffline,
  };
}
