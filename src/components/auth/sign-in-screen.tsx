import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Divider, FormScreen, Input } from '@/components/ui';
import { useEmailSignIn } from '@/hooks/auth/use-email-sign-in';
import { useSocialAuthStubs } from '@/hooks/auth/use-social-auth-stubs';
import { signInSchema, type SignInFormData } from '@/lib/schemas';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

export function SignInScreen() {
  const { colors } = useTheme();
  const { signInWithApple, signInWithGoogle, stubMessage } = useSocialAuthStubs();
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
            <Text style={[staticStyles.linkText, { color: colors.primary }]}>Need an account? Sign up</Text>
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
          <Text style={[staticStyles.serverError, { color: colors.danger }]} accessibilityRole="alert">
            {errors.root.message}
          </Text>
        ) : null}

        {!isLoaded ? (
          <Text style={[staticStyles.infoText, { color: colors.muted }]}>Preparing authentication...</Text>
        ) : null}

        <Button
          disabled={!isLoaded}
          label="Sign In"
          loading={isSubmitting}
          onPress={() => void onSubmit()}
        />

        <Divider label="or" />

        <Button
          disabled={isSubmitting}
          label="Continue with Apple (Stub)"
          onPress={() => {
            void signInWithApple().catch((error) => {
              setError('root', { message: error instanceof Error ? error.message : 'Apple stub failed.' });
            });
          }}
          variant="secondary"
        />
        <Button
          disabled={isSubmitting}
          label="Continue with Google (Stub)"
          onPress={() => {
            void signInWithGoogle().catch((error) => {
              setError('root', { message: error instanceof Error ? error.message : 'Google stub failed.' });
            });
          }}
          variant="secondary"
        />
        <Text style={[staticStyles.stubText, { color: colors.muted }]}>{stubMessage}</Text>
      </Card>
    </FormScreen>
  );
}

const staticStyles = StyleSheet.create({
  serverError: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  linkText: {
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.base,
    textAlign: 'center',
  },
  stubText: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.xs,
    textAlign: 'center',
  },
});
