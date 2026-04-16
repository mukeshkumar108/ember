import React from 'react';
import { tokens } from '@/styles/tokens';

/**
 * Returns props to spread onto a <RefreshControl> component.
 *
 * Usage:
 *   const refreshProps = useRefreshControl(refetch);
 *   <ScrollView refreshControl={<RefreshControl {...refreshProps} />}>
 *
 * Works with any TanStack Query refetch (or any async () => unknown function).
 */
export function useRefreshControl(refetch: () => unknown) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    refreshing,
    onRefresh: () => void onRefresh(),
    tintColor: tokens.colors.primary,   // iOS spinner color
    colors: [tokens.colors.primary],    // Android spinner color
  };
}
