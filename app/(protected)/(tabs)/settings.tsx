import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

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
  // TODO: Implement account deletion logic.
  // 1. Show confirmation dialog.
  // 2. Call backend DELETE /api/v1/me.
  // 3. Delete Clerk user account.
  Alert.alert(
    'Delete Account',
...
      'This is a placeholder CTA only. Account deletion logic is deferred.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.profileSection}>
        <Text style={styles.label}>Signed in as:</Text>
        <Text style={styles.value}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleDeleteAccount}>
        <Text style={styles.dangerButtonText}>Delete Account</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
         <Text style={styles.footerText}>Ember v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  profileSection: {
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  dangerButton: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});
