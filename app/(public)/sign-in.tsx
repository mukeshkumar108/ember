import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ember</Text>
      <Text style={styles.subtitle}>A practical mobile app shell.</Text>

      {/* TODO: Implement full sign-in form using Clerk's useSignIn hook.
          Reference: https://clerk.com/docs/references/react/use-sign-in */}
      <View style={styles.formPlaceholder}>
        <Text>Full sign-in form implementation deferred.</Text>
      </View>

      <Link href="/(public)/sign-up" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>
            Don&apos;t have an account? Sign up
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  formPlaceholder: {
    padding: 40,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
  },
});
