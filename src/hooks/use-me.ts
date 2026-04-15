import { ApiResponse, User } from "@/api/types";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";

export function useMe() {
  const { request } = useApi();
  const { isSignedIn, isLoaded } = useAuth();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await request<ApiResponse<User>>("/api/v1/me");

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
