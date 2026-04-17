export const validMeUserData = {
  id: 'user_123',
  clerkUserId: 'clerk_123',
  email: 'user@example.com',
  profile: {
    username: 'ember_user',
    displayName: 'Ember User',
    firstName: 'Ember',
    lastName: 'User',
    bio: null,
    imageUrl: null,
    timezone: 'Europe/London',
    locale: 'en-GB',
  },
  preferences: {
    notifications: { push: true, email: true },
    communications: { marketing: false },
    privacy: { analytics: true },
  },
  onboarding: {
    completed: true,
    completedAt: '2026-04-17T00:00:00.000Z',
  },
  subscription: {
    isPro: false,
    plan: 'free',
    status: 'none',
  },
  createdAt: '2026-04-17T00:00:00.000Z',
  updatedAt: '2026-04-17T00:00:00.000Z',
} as const;

export const validMeResponse = {
  success: true,
  data: validMeUserData,
  error: null,
} as const;

export const validUpdateMeResponse = {
  success: true,
  data: {
    ...validMeUserData,
    profile: {
      ...validMeUserData.profile,
      displayName: 'Updated Name',
    },
    updatedAt: '2026-04-17T01:00:00.000Z',
  },
  error: null,
} as const;

export const validDeviceRegistrationResponse = {
  success: true,
  data: {
    id: 'dev_123',
    userId: 'user_123',
    platform: 'ios',
    pushToken: 'ExponentPushToken[abc123]',
    appVersion: '1.0.0',
    lastSeenAt: '2026-04-17T00:00:00.000Z',
    createdAt: '2026-04-17T00:00:00.000Z',
    updatedAt: '2026-04-17T00:00:00.000Z',
  },
  error: null,
} as const;
