import { useSignUp } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { getClerkErrorMessage } from '@/auth/clerk-errors';

export function useEmailSignUp() {
  const { isLoaded, setActive, signUp } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const startSignUp = useCallback(async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password || !confirmPassword) {
      setError('Email, password, and confirmation are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isLoaded) {
      setError('Authentication is still loading. Please wait a moment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const attempt = await signUp.create({
        emailAddress: normalizedEmail,
        password,
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

      setError('Sign up is incomplete and requires additional Clerk configuration.');
    } catch (submitError) {
      setError(getClerkErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }, [confirmPassword, email, isLoaded, password, setActive, signUp]);

  const verifyEmail = useCallback(async () => {
    const normalizedCode = verificationCode.trim();

    if (!normalizedCode) {
      setError('Verification code is required.');
      return;
    }

    if (!isLoaded) {
      setError('Authentication is still loading. Please wait a moment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: normalizedCode,
      });

      if (attempt.status === 'complete' && attempt.createdSessionId && setActive) {
        await setActive({ session: attempt.createdSessionId });
        return;
      }

      setError('Verification did not complete. Please request a new code and try again.');
    } catch (submitError) {
      setError(getClerkErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }, [isLoaded, setActive, signUp, verificationCode]);

  const backToCredentials = useCallback(() => {
    setIsPendingVerification(false);
    setVerificationCode('');
    setError(null);
    setNotice(null);
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    verificationCode,
    setVerificationCode,
    isLoaded,
    isSubmitting,
    isPendingVerification,
    error,
    notice,
    startSignUp,
    verifyEmail,
    backToCredentials,
  };
}
