import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, FormScreen, Input } from '@/components/ui';
import { useEmailSignUp } from '@/hooks/auth/use-email-sign-up';
import { tokens } from '@/styles/tokens';

export function SignUpScreen() {
  const {
    backToCredentials,
    confirmPassword,
    email,
    error,
    isLoaded,
    isPendingVerification,
    isSubmitting,
    notice,
    password,
    setConfirmPassword,
    setEmail,
    setPassword,
    setVerificationCode,
    startSignUp,
    verificationCode,
    verifyEmail,
  } = useEmailSignUp();

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
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </Pressable>
        </Link>
      }>
      <Card>
        {isPendingVerification ? (
          <Input
            autoCapitalize="none"
            autoComplete="one-time-code"
            keyboardType="number-pad"
            label="Verification code"
            onChangeText={setVerificationCode}
            value={verificationCode}
            error={error ?? undefined}
          />
        ) : (
          <View style={styles.fieldGroup}>
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
              autoComplete="new-password"
              label="Password"
              onChangeText={setPassword}
              secureTextEntry
              value={password}
            />
            <Input
              autoCapitalize="none"
              autoComplete="new-password"
              label="Confirm password"
              onChangeText={setConfirmPassword}
              secureTextEntry
              value={confirmPassword}
            />
          </View>
        )}

        {notice ? <Text style={styles.noticeText}>{notice}</Text> : null}
        {!isLoaded ? <Text style={styles.infoText}>Preparing authentication...</Text> : null}

        {isPendingVerification ? (
          <View style={styles.buttonGroup}>
            <Button
              disabled={!isLoaded}
              label="Verify and Continue"
              loading={isSubmitting}
              onPress={() => void verifyEmail()}
            />
            <Button
              disabled={!isLoaded || isSubmitting}
              label="Back"
              onPress={backToCredentials}
              variant="secondary"
            />
          </View>
        ) : (
          <Button
            disabled={!isLoaded}
            label="Create Account"
            loading={isSubmitting}
            onPress={() => void startSignUp()}
          />
        )}
      </Card>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: tokens.spacing.md,
  },
  noticeText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.sizes.sm,
  },
  infoText: {
    color: tokens.colors.muted,
    fontSize: tokens.typography.sizes.sm,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: tokens.spacing.sm,
  },
  linkText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.sizes.base,
    fontWeight: tokens.typography.weights.medium,
    textAlign: 'center',
  },
});
