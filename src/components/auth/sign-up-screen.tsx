import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, FormScreen, Input } from '@/components/ui';
import { useEmailSignUp } from '@/hooks/auth/use-email-sign-up';
import {
  signUpSchema,
  verificationCodeSchema,
  type SignUpFormData,
  type VerificationCodeFormData,
} from '@/lib/schemas';
import { tokens } from '@/styles/tokens';
import { useTheme } from '@/providers/theme-provider';

export function SignUpScreen() {
  const { colors } = useTheme();
  const { isLoaded, isSubmitting, isPendingVerification, notice, startSignUp, verifyEmail, backToCredentials } =
    useEmailSignUp();

  // Two separate forms — credentials step and verification step
  const credentialsForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const verificationForm = useForm<VerificationCodeFormData>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: { code: '' },
  });

  const onStartSignUp = credentialsForm.handleSubmit(async (data) => {
    try {
      await startSignUp(data);
    } catch (e) {
      credentialsForm.setError('root', {
        message: e instanceof Error ? e.message : 'Sign up failed.',
      });
    }
  });

  const onVerifyEmail = verificationForm.handleSubmit(async (data) => {
    try {
      await verifyEmail(data);
    } catch (e) {
      verificationForm.setError('root', {
        message: e instanceof Error ? e.message : 'Verification failed.',
      });
    }
  });

  return (
    <FormScreen
      title={isPendingVerification ? 'Verify Email' : 'Create Account'}
      subtitle={
        isPendingVerification
          ? 'Complete sign up with the verification code sent to your email.'
          : 'Create an Ember account with email and password.'
      }
      footer={
        <Link asChild href="/(public)/sign-in">
          <Pressable>
            <Text style={[staticStyles.linkText, { color: colors.primary }]}>Already have an account? Sign in</Text>
          </Pressable>
        </Link>
      }>
      <Card>
        {isPendingVerification ? (
          <>
            <Controller
              control={verificationForm.control}
              name="code"
              render={({ field, fieldState }) => (
                <Input
                  autoCapitalize="none"
                  autoComplete="one-time-code"
                  keyboardType="number-pad"
                  label="Verification code"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            {notice ? (
              <Text style={[staticStyles.noticeText, { color: colors.primary }]}>{notice}</Text>
            ) : null}
            {verificationForm.formState.errors.root ? (
              <Text style={[staticStyles.serverError, { color: colors.danger }]} accessibilityRole="alert">
                {verificationForm.formState.errors.root.message}
              </Text>
            ) : null}
            {!isLoaded ? (
              <Text style={[staticStyles.infoText, { color: colors.muted }]}>Preparing authentication...</Text>
            ) : null}

            <View style={staticStyles.buttonGroup}>
              <Button
                disabled={!isLoaded}
                label="Verify and Continue"
                loading={isSubmitting}
                onPress={() => void onVerifyEmail()}
              />
              <Button
                disabled={!isLoaded || isSubmitting}
                label="Back"
                onPress={backToCredentials}
                variant="secondary"
              />
            </View>
          </>
        ) : (
          <>
            <Controller
              control={credentialsForm.control}
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
              control={credentialsForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <Input
                  autoCapitalize="none"
                  autoComplete="new-password"
                  label="Password"
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={credentialsForm.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Input
                  autoCapitalize="none"
                  autoComplete="new-password"
                  label="Confirm password"
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            {credentialsForm.formState.errors.root ? (
              <Text style={[staticStyles.serverError, { color: colors.danger }]} accessibilityRole="alert">
                {credentialsForm.formState.errors.root.message}
              </Text>
            ) : null}
            {!isLoaded ? (
              <Text style={[staticStyles.infoText, { color: colors.muted }]}>Preparing authentication...</Text>
            ) : null}

            <Button
              disabled={!isLoaded}
              label="Create Account"
              loading={isSubmitting}
              onPress={() => void onStartSignUp()}
            />
          </>
        )}
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
  noticeText: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
  },
  infoText: {
    fontFamily: tokens.typography.fonts.regular,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: tokens.spacing.sm,
  },
  linkText: {
    fontFamily: tokens.typography.fonts.medium,
    fontSize: tokens.typography.sizes.base,
    textAlign: 'center',
  },
});
