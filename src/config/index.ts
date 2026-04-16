import { Platform } from "react-native";

/**
 * Backend API URL based on platform.
 * forgingfire backend assumptions.
 */
const defaultApiUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://localhost:3001");

export const API_URL = process.env.EXPO_PUBLIC_API_URL || defaultApiUrl;

/**
 * Clerk configuration.
 */
export const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Please set it in your environment.",
  );
}
