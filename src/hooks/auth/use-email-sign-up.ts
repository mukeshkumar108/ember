import { useSignUp } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { getClerkErrorMessage } from '@/auth/clerk-errors';
import type { SignUpFormData, VerificationCodeFormData } from '@/lib/schemas';

/**
 * Handles the Clerk sign-up and verification API calls.
 * Form state (values, validation) is owned by the screen via react-hook-form.
 * This hook owns async side effects, loading state, and the verification flow step.
 */
export function useEmailSignUp() {
  const { isLoaded, setActive, signUp } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const startSignUp = useCallback(
    async (data: SignUpFormData) => {
      if (!isLoaded) {
        throw new Error('Authentication is still loading. Please wait a moment.');
      }

      setIsSubmitting(true);
      setNotice(null);
      try {
        const attempt = await signUp.create({
          emailAddress: data.email.trim(),
          password: data.password,
        });

        if (attempt.status === 'complete' && attempt.createdSessionId && setActive) {
          await setActive({ session: attempt.createdSessionId });
          return;
        }

        const needsEmailVerification = attempt.unverifiedFields.includes('email_address');
        if (needsEmailVerification) {
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setIsPendingVerification(true);
          setNotice('Enter the email verification code to complete sign up.');
          return;
        }

        throw new Error('Sign up is incomplete and requires additional Clerk configuration.');
      } catch (err) {
        throw new Error(getClerkErrorMessage(err));
      } finally {
        setIsSubmitting(false);
      }
    },
    [isLoaded, setActive, signUp],
  );

  const verifyEmail = useCallback(
    async (data: VerificationCodeFormData) => {
      if (!isLoaded) {
        throw new Error('Authentication is still loading. Please wait a moment.');
      }

      setIsSubmitting(true);
      setNotice(null);
      try {
        const attempt = await signUp.attemptEmailAddressVerification({
          code: data.code.trim(),
        });

        if (attempt.status === 'complete' && attempt.createdSessionId && setActive) {
          await setActive({ session: attempt.createdSessionId });
          return;
        }

        throw new Error('Verification did not complete. Please request a new code and try again.');
      } catch (err) {
        throw new Error(getClerkErrorMessage(err));
      } finally {
        setIsSubmitting(false);
      }
    },
    [isLoaded, setActive, signUp],
  );

  const backToCredentials = useCallback(() => {
    setIsPendingVerification(false);
    setNotice(null);
  }, []);

  return {
    isLoaded,
    isSubmitting,
    isPendingVerification,
    notice,
    startSignUp,
    verifyEmail,
    backToCredentials,
  };
}
