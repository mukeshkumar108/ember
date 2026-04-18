import { useCallback } from 'react';

const APPLE_STUB_ERROR =
  'Apple sign-in stub only. Complete Clerk OAuth wiring before enabling in production.';
const GOOGLE_STUB_ERROR =
  'Google sign-in stub only. Complete Clerk OAuth wiring before enabling in production.';

export function useSocialAuthStubs() {
  const signInWithApple = useCallback(async () => {
    throw new Error(APPLE_STUB_ERROR);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    throw new Error(GOOGLE_STUB_ERROR);
  }, []);

  return {
    signInWithApple,
    signInWithGoogle,
    stubMessage:
      'Social auth buttons are starter stubs and must be wired to Clerk OAuth for real sign-in.',
  };
}
