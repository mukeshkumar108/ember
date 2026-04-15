# Project Status Report (Operationally Honest)

**Project**: Ember Shell  
**Checkpoint**: Public Auth Flow Implementation (2026-04-15)  
**Maturity**: 0.1.x foundation baseline

## What Is Solid
- **Routing shell**: Public and protected route groups are wired and stable.
- **Auth wiring**: Clerk Provider + SecureStore token cache are in place.
- **Public auth flow**: Email/password sign-in and sign-up are implemented with proper Clerk session activation.
- **Verification handling**: Sign-up verification is conditional and only triggered when Clerk requires email verification.
- **Bootstrap contract shape**: `/api/v1/me` is typed as `{ success, data, error }` and unwrapped through `useMe`.
- **Protected guard behavior**: Protected layout now blocks access when bootstrap fails and exposes retry/sign-out controls.
- **Foundation lint health**: Current warnings in core starter files are cleared.
- **Startup polish**: Provider-level `ClerkLoading` state now shows intentional boot loader before auth hydration completes.

## What Is Intentionally Placeholder
- `app/(protected)/onboarding/index.tsx` is still a placeholder completion step.
- `src/hooks/use-device-registration.ts` is reserved for later device sync and currently no-op.

## Active Assumptions
- Backend serves `GET /api/v1/me` at `${EXPO_PUBLIC_API_URL}/api/v1/me` for authenticated users.
- `User.onboarding.completed` remains the canonical field for onboarding guard redirects.
- Clerk tokens used by `getToken()` are accepted by forgingfire as Bearer auth.

## Current Risks
- **No onboarding completion API wired**: completing onboarding currently only routes to tabs.
- **Sign-in edge paths**: accounts requiring non-password factors (MFA/SSO-only) currently receive a generic “additional steps required” message.
- **Guard UX depends on backend availability**: if API URL/session is wrong, protected users now see explicit bootstrap failure state (expected), but this still needs productized copy and recovery flow.

## Immediate Next Task
Wire onboarding completion to backend, then refetch/invalidate `/api/v1/me` so onboarding guard state updates from server truth.
