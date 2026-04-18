import { describe, expect, it } from 'vitest';
import { mapNetInfoStateToNetworkStatus } from './network-status.utils';

describe('mapNetInfoStateToNetworkStatus', () => {
  it('marks offline when disconnected', () => {
    const status = mapNetInfoStateToNetworkStatus({
      type: 'none',
      isConnected: false,
      isInternetReachable: false,
      details: null,
    } as any);

    expect(status.isOffline).toBe(true);
    expect(status.isConnected).toBe(false);
    expect(status.hasInitialized).toBe(true);
  });

  it('marks offline when internet is unreachable despite connection', () => {
    const status = mapNetInfoStateToNetworkStatus({
      type: 'wifi',
      isConnected: true,
      isInternetReachable: false,
      details: null,
    } as any);

    expect(status.isOffline).toBe(true);
  });

  it('marks online when connected and reachable', () => {
    const status = mapNetInfoStateToNetworkStatus({
      type: 'wifi',
      isConnected: true,
      isInternetReachable: true,
      details: null,
    } as any);

    expect(status.isOffline).toBe(false);
  });
});
