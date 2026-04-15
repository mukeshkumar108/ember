import { useAuth, useUser } from '@clerk/clerk-expo';
export * from './clerk-errors';

/**
 * Custom hook to provide common auth-related helpers.
 * For phase-1, we'll keep it simple.
 */
export function useAppAuth() {
  const { isLoaded, isSignedIn, signOut, getToken } = useAuth();
  const { user } = useUser();

  return {
    isLoaded,
    isSignedIn,
    user,
    signOut,
    getToken,
    // Add more helpers if needed (e.g., checking roles)
  };
}
