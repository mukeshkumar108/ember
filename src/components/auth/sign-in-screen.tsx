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
import { useEmailSignIn } from '@/hooks/auth/use-email-sign-in';

export function SignInScreen() {
  const { email, error, isLoaded, isSubmitting, onSubmit, password, setEmail, setPassword } =
    useEmailSignIn();

  const isDisabled = !isLoaded || isSubmitting;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Use your email and password to continue.</Text>
        </View>

        <View style={styles.form}>
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
            autoComplete="password"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#8f8f8f"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable disabled={isDisabled} onPress={() => void onSubmit()} style={styles.button}>
            <Text style={styles.buttonText}>{isSubmitting ? 'Signing in...' : 'Sign In'}</Text>
          </Pressable>

          {!isLoaded ? <Text style={styles.infoText}>Preparing authentication...</Text> : null}
        </View>

        <Link asChild href="/(public)/sign-up">
          <Pressable style={styles.linkButton}>
            <Text style={styles.linkText}>Need an account? Sign up</Text>
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
