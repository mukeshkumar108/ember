import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { getClerkErrorMessage } from '@/auth/clerk-errors';
import type { SignInFormData } from '@/lib/schemas';

/**
 * Handles the Clerk sign-in API call.
 * Form state (values, validation) is owned by the screen via react-hook-form.
 * This hook owns only the async side effect and loading state.
 */
export function useEmailSignIn() {
  const { isLoaded, setActive, signIn } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(
    async (data: SignInFormData) => {
      if (!isLoaded) {
        throw new Error('Authentication is still loading. Please wait a moment.');
      }

      setIsSubmitting(true);
      try {
        const attempt = await signIn.create({
          identifier: data.email.trim(),
          password: data.password,
        });

        if (attempt.status === 'complete' && attempt.createdSessionId && setActive) {
          await setActive({ session: attempt.createdSessionId });
          return;
        }

        throw new Error('Additional sign-in steps are required for this account.');
      } catch (err) {
        throw new Error(getClerkErrorMessage(err));
      } finally {
        setIsSubmitting(false);
      }
    },
    [isLoaded, setActive, signIn],
  );

  return { submit, isSubmitting, isLoaded };
}
