/**
 * Shared Zod schemas for Ember forms.
 *
 * Keep schemas generic — no product-specific business rules here.
 * Add product-specific schemas in the feature that owns them.
 */
import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const verificationCodeSchema = z.object({
  code: z.string().min(1, 'Verification code is required'),
});

export type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  displayName: z.string().max(64, 'Display name must be 64 characters or fewer'),
  firstName: z.string().max(64, 'First name must be 64 characters or fewer'),
  lastName: z.string().max(64, 'Last name must be 64 characters or fewer'),
  bio: z.string().max(500, 'Bio must be 500 characters or fewer'),
  locale: z.string(),
  timezone: z.string(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
