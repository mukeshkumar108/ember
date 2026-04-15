import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { getClerkErrorMessage } from '@/auth/clerk-errors';

export function useEmailSignIn() {
  const { isLoaded, setActive, signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    if (!isLoaded) {
      setError('Authentication is still loading. Please wait a moment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const attempt = await signIn.create({
        identifier: normalizedEmail,
        password,
      });

      if (attempt.status === 'complete' && attempt.createdSessionId && setActive) {
        await setActive({ session: attempt.createdSessionId });
        return;
      }

      setError('Additional sign-in steps are required for this account.');
    } catch (submitError) {
      setError(getClerkErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }, [email, isLoaded, password, setActive, signIn]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoaded,
    isSubmitting,
    error,
    onSubmit,
  };
}
