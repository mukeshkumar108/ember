import { useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import { RequestConfig, request } from '@/api/client';

export function useApi() {
  const { getToken } = useAuth();

  const apiRequest = useCallback(
    async <T>(path: string, config: RequestConfig = {}) => {
      const token = await getToken();
      return request<T>(path, { ...config, token });
    },
    [getToken]
  );

  return { request: apiRequest };
}
