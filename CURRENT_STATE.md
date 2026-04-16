# Project Status Report (Operationally Honest)

**Project**: Ember Shell  
**Checkpoint**: Onboarding Completion Wiring (2026-04-16)  
**Maturity**: 0.1.x foundation baseline

## What Is Solid
- **Routing shell**: Public and protected route groups are wired and stable.
- **Auth wiring**: Clerk Provider + SecureStore token cache are in place.
- **Public auth flow**: Email/password sign-in and sign-up are implemented with proper Clerk session activation.
- **Verification handling**: Sign-up verification is conditional and only triggered when Clerk requires email verification.
- **Bootstrap contract shape**: `/api/v1/me` is typed as `{ success, data, error }` and unwrapped through `useMe`.
- **Onboarding completion flow**: onboarding now updates backend via `PATCH /api/v1/me` then invalidates/refetches `me`.
- **Protected guard behavior**: Protected layout now blocks access when bootstrap fails and exposes retry/sign-out controls.
- **Onboarding exit behavior**: once onboarding is completed and `me` updates, protected layout routes the user into tabs.
- **Foundation lint health**: Current warnings in core starter files are cleared.
- **Startup polish**: Provider-level `ClerkLoading` state now shows intentional boot loader before auth hydration completes.

## What Is Intentionally Placeholder
- `app/(protected)/onboarding/index.tsx` remains intentionally simple (single completion action, no multi-step product flow).
- `src/hooks/use-device-registration.ts` is reserved for later device sync and currently no-op.

## Active Assumptions
- Backend serves `GET /api/v1/me` at `${EXPO_PUBLIC_API_URL}/api/v1/me` for authenticated users.
- `User.onboarding.completed` remains the canonical field for onboarding guard redirects.
- Clerk tokens used by `getToken()` are accepted by forgingfire as Bearer auth.

## Current Risks
- **Sign-in edge paths**: accounts requiring non-password factors (MFA/SSO-only) currently receive a generic “additional steps required” message.
- **Guard UX depends on backend availability**: if API URL/session is wrong, protected users now see explicit bootstrap failure state (expected), but this still needs productized copy and recovery flow.

## Immediate Next Task
Implement `POST /api/v1/devices` registration in `useDeviceRegistration` and wire it to run safely after auth bootstrap.
