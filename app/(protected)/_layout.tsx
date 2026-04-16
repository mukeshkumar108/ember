import { Redirect, Stack, useSegments } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDeviceRegistration } from '@/hooks/use-device-registration';
import { useMe } from '@/hooks/use-me';
import { ApiError } from '@/api/client';

function FullScreenLoader() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  );
}

function BootstrapErrorState({
  message,
  onRetry,
  onSignOut,
}: {
  message: string;
  onRetry: () => void;
  onSignOut: () => Promise<void>;
}) {
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Could not load your account</Text>
      <Text style={styles.body}>{message}</Text>

      <Pressable style={styles.primaryButton} onPress={onRetry}>
        <Text style={styles.primaryButtonText}>Retry</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => void onSignOut()}>
        <Text style={styles.secondaryButtonText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

export default function ProtectedLayout() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { data: user, error, isError, isLoading: isUserLoading, refetch } = useMe();
  const segments = useSegments();
  useDeviceRegistration();

  if (!isLoaded || (isSignedIn && isUserLoading)) {
    return <FullScreenLoader />;
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
      <BootstrapErrorState
        message={message}
        onRetry={() => void refetch()}
        onSignOut={() => signOut()}
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

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: '#555',
  },
});
