import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Button, Card, FormScreen, Input } from '@/components/ui';
import { useEmailSignIn } from '@/hooks/auth/use-email-sign-in';
import { tokens } from '@/styles/tokens';

export function SignInScreen() {
  const { email, error, isLoaded, isSubmitting, onSubmit, password, setEmail, setPassword } =
    useEmailSignIn();

  return (
    <FormScreen
      title="Sign In"
      subtitle="Use your email and password to continue."
      footer={
        <Link asChild href="/(public)/sign-up">
          <Pressable>
            <Text style={styles.linkText}>Need an account? Sign up</Text>
          </Pressable>
        </Link>
      }>
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
    </FormScreen>
  );
}

const styles = StyleSheet.create({
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
