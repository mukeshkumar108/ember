export interface ApiErrorPayload {
  message: string;
  code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiErrorPayload | null;
}

export interface UserProfile {
  username: string | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  imageUrl: string | null;
  timezone: string | null;
  locale: string | null;
}

export interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
  };
  communications: {
    marketing: boolean;
  };
  privacy: {
    analytics: boolean;
  };
}

export interface UserOnboarding {
  completed: boolean;
  completedAt: string | null;
}

export interface UserSubscription {
  isPro: boolean;
  plan: "free" | "pro";
  status: "active" | "trialing" | "none";
}

export interface User {
  id: string;
  clerkUserId: string;
  email: string | null;
  profile: UserProfile;
  preferences: UserPreferences;
  onboarding: UserOnboarding;
  subscription: UserSubscription;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMeRequest {
  profile?: Partial<UserProfile>;
  preferences?: Partial<UserPreferences>;
  onboarding?: {
    completed?: true;
  };
}

export interface RegisterDeviceRequest {
  platform: 'ios' | 'android' | 'web';
  pushToken: string;
  appVersion?: string;
}

export interface Device {
  id: string;
  userId: string;
  platform: 'ios' | 'android' | 'web';
  pushToken: string;
  appVersion: string | null;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}
