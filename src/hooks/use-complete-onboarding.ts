import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { ApiResponse, UpdateMeRequest, User } from '@/api/types';

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
      const response = await request<ApiResponse<User>>('/api/v1/me', {
        method: 'PATCH',
        body: COMPLETE_ONBOARDING_BODY,
      });

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
