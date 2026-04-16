import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { ApiResponse, UpdateMeRequest, User } from '@/api/types';

export function useUpdateMe() {
  const { request } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateMeRequest) => {
      const response = await request<ApiResponse<User>>('/api/v1/me', {
        method: 'PATCH',
        body,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update account');
      }

      return response.data;
    },
    onSuccess: async (user) => {
      queryClient.setQueryData(['me'], user);
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      await queryClient.refetchQueries({ queryKey: ['me'], type: 'active' });
    },
  });
}
