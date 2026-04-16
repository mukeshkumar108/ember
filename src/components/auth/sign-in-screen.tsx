import { Link } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { Button, Card, Input, Screen, Section } from '@/components/ui';
import { useEmailSignIn } from '@/hooks/auth/use-email-sign-in';
import { tokens } from '@/styles/tokens';

export function SignInScreen() {
  const { email, error, isLoaded, isSubmitting, onSubmit, password, setEmail, setPassword } =
    useEmailSignIn();

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.layout}>
        <Section title="Sign In">
          <Text style={styles.subtitle}>Use your email and password to continue.</Text>
        </Section>

        <Card>
          <Input
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Email"
            onChangeText={setEmail}
            value={email}
            error={error ?? undefined}
          />
          <Input
            autoCapitalize="none"
            autoComplete="password"
            label="Password"
            onChangeText={setPassword}
            secureTextEntry
            value={password}
          />

          {!isLoaded ? <Text style={styles.infoText}>Preparing authentication...</Text> : null}

          <Button
            disabled={!isLoaded}
            label="Sign In"
            loading={isSubmitting}
            onPress={() => void onSubmit()}
          />
        </Card>

        <Link asChild href="/(public)/sign-up">
          <Pressable>
            <Text style={styles.linkText}>Need an account? Sign up</Text>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'space-between',
    gap: tokens.spacing.xl,
  },
  subtitle: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.base,
    lineHeight: 22,
  },
  infoText: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  linkText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.medium,
    textAlign: 'center',
  },
});
