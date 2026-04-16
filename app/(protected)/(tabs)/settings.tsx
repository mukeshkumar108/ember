import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Button, Card, Screen, Section } from '@/components/ui';
import { tokens } from '@/styles/tokens';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(public)/sign-in');
    } catch (err) {
      console.error('Sign out error', err);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This is a placeholder CTA only. Account deletion logic is deferred.',
      [{ text: 'OK' }],
    );
  };

  return (
    <Screen scroll>
      <Section title="Settings">
        <Card>
          <Text style={styles.label}>Signed in as</Text>
          <Text style={styles.value}>{user?.primaryEmailAddress?.emailAddress ?? 'Unknown email'}</Text>
        </Card>
      </Section>

      <Section title="Account Actions">
        <Button label="Log Out" onPress={() => void handleSignOut()} variant="secondary" />
        <Button label="Delete Account" onPress={handleDeleteAccount} variant="danger" />
      </Section>

      <Section title="Developer">
        <Button label="Open UI Playground" onPress={() => router.push('/(protected)/(tabs)/playground')} variant="secondary" />
      </Section>

      <Text style={styles.footer}>Ember v1.0.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
  },
  value: {
    color: tokens.colors.foreground,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.medium,
  },
  footer: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
});
