import { CLERK_PUBLISHABLE_KEY } from "@/config";
import { ToastProvider } from "@/components/ui";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ThemeProvider, useTheme } from "./theme-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

function BootLoader() {
  const { colors } = useTheme();
  return (
    <View style={[styles.bootLoader, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <ClerkLoading>
          <BootLoader />
        </ClerkLoading>
        <ClerkLoaded>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>{children}</ToastProvider>
          </QueryClientProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  bootLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
