import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { meResponseSchema } from '@/api/schemas';
import { UpdateMeRequest } from '@/api/types';
import { parseApiContract } from '@/api/validation';

const COMPLETE_ONBOARDING_BODY: UpdateMeRequest = {
  onboarding: {
    completed: true,
  },
};

export function useCompleteOnboarding() {
  const { request } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const rawResponse = await request<unknown>('/api/v1/me', {
        method: 'PATCH',
        body: COMPLETE_ONBOARDING_BODY,
      });
      const response = parseApiContract(
        meResponseSchema,
        rawResponse,
        'PATCH /api/v1/me response (onboarding)',
      );

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to complete onboarding');
      }

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      await queryClient.refetchQueries({ queryKey: ['me'], type: 'active' });
    },
  });
}
