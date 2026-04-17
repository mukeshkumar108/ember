import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { meResponseSchema } from '@/api/schemas';
import { UpdateMeRequest } from '@/api/types';
import { parseApiContract } from '@/api/validation';

export function useUpdateMe() {
  const { request } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateMeRequest) => {
      const rawResponse = await request<unknown>('/api/v1/me', {
        method: 'PATCH',
        body,
      });
      const response = parseApiContract(
        meResponseSchema,
        rawResponse,
        'PATCH /api/v1/me response',
      );

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
