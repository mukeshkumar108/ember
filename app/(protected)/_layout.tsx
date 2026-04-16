import { Redirect, Stack, useSegments } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useDeviceRegistration } from '@/hooks/use-device-registration';
import { useMe } from '@/hooks/use-me';
import { ApiError } from '@/api/client';
import { ErrorState, LoadingState } from '@/components/feedback';

export default function ProtectedLayout() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { data: user, error, isError, isLoading: isUserLoading, refetch } = useMe();
  const segments = useSegments();
  useDeviceRegistration();

  if (!isLoaded || (isSignedIn && isUserLoading)) {
    return <LoadingState fullScreen message="Loading account..." />;
  }

  if (!isSignedIn) {
    return <Redirect href="/(public)/sign-in" />;
  }

  if (isError || !user) {
    const message =
      error instanceof ApiError
        ? `Request failed (${error.status}). Check your API URL and active session.`
        : 'Unable to load /api/v1/me. Please retry.';

    return (
      <ErrorState
        fullScreen
        title="Could not load your account"
        message={message}
        onRetry={() => void refetch()}
        secondaryActionLabel="Sign out"
        onSecondaryAction={() => void signOut()}
      />
    );
  }

  // Redirect to onboarding if not completed and not already on onboarding screen
  const isOnOnboarding = segments[1] === 'onboarding';
  if (!user.onboarding.completed && !isOnOnboarding) {
    return <Redirect href="/(protected)/onboarding" />;
  }
  if (user.onboarding.completed && isOnOnboarding) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal' }} />
    </Stack>
  );
}
