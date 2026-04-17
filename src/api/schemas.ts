import { z } from 'zod';

export const apiErrorPayloadSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
});

export const userProfileSchema = z.object({
  username: z.string().nullable(),
  displayName: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  bio: z.string().nullable(),
  imageUrl: z.string().nullable(),
  timezone: z.string().nullable(),
  locale: z.string().nullable(),
});

export const userPreferencesSchema = z.object({
  notifications: z.object({
    push: z.boolean(),
    email: z.boolean(),
  }),
  communications: z.object({
    marketing: z.boolean(),
  }),
  privacy: z.object({
    analytics: z.boolean(),
  }),
});

export const userOnboardingSchema = z.object({
  completed: z.boolean(),
  completedAt: z.string().nullable(),
});

export const userSubscriptionSchema = z.object({
  isPro: z.boolean(),
  plan: z.enum(['free', 'pro']),
  status: z.enum(['active', 'trialing', 'none']),
});

export const userSchema = z.object({
  id: z.string(),
  clerkUserId: z.string(),
  email: z.string().nullable(),
  profile: userProfileSchema,
  preferences: userPreferencesSchema,
  onboarding: userOnboardingSchema,
  subscription: userSubscriptionSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    error: apiErrorPayloadSchema.nullable(),
  });
}

export const meResponseSchema = apiResponseSchema(userSchema);
export const registerDeviceRequestSchema = z
  .object({
    platform: z.enum(['ios', 'android', 'web']),
    pushToken: z.string().trim().min(1).max(2048),
    appVersion: z.string().trim().min(1).max(64).optional(),
  })
  .strict();

export const deviceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  platform: z.enum(['ios', 'android', 'web']),
  pushToken: z.string(),
  appVersion: z.string().nullable(),
  lastSeenAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const registerDeviceResponseSchema = apiResponseSchema(deviceSchema);

export type MeResponse = z.infer<typeof meResponseSchema>;
export type RegisterDeviceResponse = z.infer<typeof registerDeviceResponseSchema>;
