import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, FormScreen, Input } from '@/components/ui';
import { useEmailSignIn } from '@/hooks/auth/use-email-sign-in';
import { signInSchema, type SignInFormData } from '@/lib/schemas';
import { tokens } from '@/styles/tokens';

export function SignInScreen() {
  const { submit, isSubmitting, isLoaded } = useEmailSignIn();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await submit(data);
    } catch (e) {
      setError('root', { message: e instanceof Error ? e.message : 'Sign in failed.' });
    }
  });

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
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              label="Email"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              autoCapitalize="none"
              autoComplete="password"
              label="Password"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        {errors.root ? (
          <Text style={styles.serverError} accessibilityRole="alert">
            {errors.root.message}
          </Text>
        ) : null}

        {!isLoaded ? (
          <Text style={styles.infoText}>Preparing authentication...</Text>
        ) : null}

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
  serverError: {
    color: tokens.colors.danger,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
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
