import { Redirect, Stack, useSegments } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator } from 'react-native';
import { useDeviceRegistration } from '@/hooks/use-device-registration';
import { useMe } from '@/hooks/use-me';

export default function ProtectedLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { data: user, isLoading: isUserLoading } = useMe();
  const segments = useSegments();
  useDeviceRegistration();

  if (!isLoaded || (isSignedIn && isUserLoading)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(public)/sign-in" />;
  }

  // Redirect to onboarding if not completed and not already on onboarding screen
  const isOnOnboarding = segments[1] === 'onboarding';
  if (user && !user.onboarding.completed && !isOnOnboarding) {
    return <Redirect href="/(protected)/onboarding" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal' }} />
    </Stack>
  );
}
