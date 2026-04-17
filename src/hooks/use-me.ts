import { meResponseSchema } from '@/api/schemas';
import { parseApiContract } from '@/api/validation';
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";

export function useMe() {
  const { request } = useApi();
  const { isSignedIn, isLoaded } = useAuth();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const rawResponse = await request<unknown>('/api/v1/me');
      const response = parseApiContract(
        meResponseSchema,
        rawResponse,
        'GET /api/v1/me response',
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.error?.message || "Failed to fetch current user",
        );
      }

      return response.data;
    },
    enabled: isLoaded && isSignedIn,
  });
}
