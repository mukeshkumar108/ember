import { Link } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEmailSignUp } from '@/hooks/auth/use-email-sign-up';

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

  const isDisabled = !isLoaded || isSubmitting;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{isPendingVerification ? 'Verify Email' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>
            {isPendingVerification
              ? 'Complete sign up with the verification code sent to your email.'
              : 'Create an Ember account with email and password.'}
          </Text>
        </View>

        <View style={styles.form}>
          {isPendingVerification ? (
            <TextInput
              autoCapitalize="none"
              autoComplete="one-time-code"
              keyboardType="number-pad"
              onChangeText={setVerificationCode}
              placeholder="Verification code"
              placeholderTextColor="#8f8f8f"
              style={styles.input}
              value={verificationCode}
            />
          ) : (
            <>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#8f8f8f"
                style={styles.input}
                value={email}
              />
              <TextInput
                autoCapitalize="none"
                autoComplete="new-password"
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#8f8f8f"
                secureTextEntry
                style={styles.input}
                value={password}
              />
              <TextInput
                autoCapitalize="none"
                autoComplete="new-password"
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="#8f8f8f"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
              />
            </>
          )}

          {notice ? <Text style={styles.noticeText}>{notice}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {isPendingVerification ? (
            <>
              <Pressable disabled={isDisabled} onPress={() => void verifyEmail()} style={styles.button}>
                <Text style={styles.buttonText}>{isSubmitting ? 'Verifying...' : 'Verify and Continue'}</Text>
              </Pressable>
              <Pressable disabled={isDisabled} onPress={backToCredentials} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </Pressable>
            </>
          ) : (
            <Pressable disabled={isDisabled} onPress={() => void startSignUp()} style={styles.button}>
              <Text style={styles.buttonText}>{isSubmitting ? 'Creating account...' : 'Create Account'}</Text>
            </Pressable>
          )}

          {!isLoaded ? <Text style={styles.infoText}>Preparing authentication...</Text> : null}
        </View>

        <Link asChild href="/(public)/sign-in">
          <Pressable style={styles.linkButton}>
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#fff',
  },
  noticeText: {
    color: '#1d4ed8',
    fontSize: 14,
  },
  errorText: {
    color: '#c0392b',
    fontSize: 14,
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: '#111',
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#444',
    fontWeight: '500',
    fontSize: 15,
  },
  linkButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '500',
  },
});
