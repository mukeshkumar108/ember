import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCompleteOnboarding } from "@/hooks/use-complete-onboarding";

export default function OnboardingScreen() {
  const { error, isPending, mutate } = useCompleteOnboarding();
  const errorMessage = error instanceof Error ? error.message : "Failed to complete onboarding.";

  const handleComplete = () => {
    mutate();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Let&apos;s get you set up.</Text>

      <View style={styles.contentPlaceholder}>
        {/* TODO: Implement multi-step onboarding flow.
            Steps should sync with backend using the useApi hook. */}
        <Text>Onboarding steps go here.</Text>
      </View>

      {error ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {isPending ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>Saving onboarding status...</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.button, isPending ? styles.buttonDisabled : null]}
        onPress={handleComplete}
        disabled={isPending}>
        <Text style={styles.buttonText}>{isPending ? "Completing..." : "Get Started"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 48,
  },
  contentPlaceholder: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
  },
  errorText: {
    color: "#c0392b",
    marginBottom: 12,
    textAlign: "center",
  },
});
