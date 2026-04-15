# Project Status Report (Operationally Honest)

**Project**: Ember Shell  
**Current Commit**: Backend Contract Alignment  
**Maturity**: 0.1.0-alpha (Foundation Wired)

## Implementation Summary

Ember is a **wired skeleton** now aligned with the verified `forgingfire` backend contract.

### Operational Modules
- **Routing**: Expo Router `app/(public)` and `app/(protected)` groups are wired.
- **Auth**: Clerk integration is initialized. **Note: Sign-in/Sign-up forms are UI placeholders.**
- **API**: A typed client exists in `src/api/client.ts`. It correctly injects Clerk tokens.
- **Data Fetching**: TanStack Query is configured.
- **Bootstrapping**: `useMe` is aligned with the `{ success, data, error }` contract and unwraps the nested `User` object.
- **DTOs**: Formalized `ApiResponse<T>` and `User` types in `src/api/types.ts`.

## Immediate Priorities
1. **Implement Auth Forms**: Replace placeholders in `app/(public)/sign-in.tsx` and `sign-up.tsx` with functional Clerk components.
2. **Onboarding logic**: Implement the multi-step flow in `app/(protected)/onboarding/index.tsx`.
3. **Verify Error Handling**: Refine how `ApiError` from `src/api/client.ts` is surfaced in the UI.

## Critical Assumptions & Unresolved Risks
- **Live Verification**: While the types are aligned with the contract, live communication with the `forgingfire` backend is still pending (needs valid Clerk session).
- **Assumed Endpoints**: The app assumes `/api/v1/me` and `/api/v1/devices` exist and are accessible.
- **Clerk Setup**: The app will not load beyond the Splash screen if `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is invalid or missing.
- **Routing Logic**: The onboarding guard in `app/(protected)/_layout.tsx` is unverified and may cause redirect loops if the backend state is inconsistent.

## Infrastructure Risks
- **Type Safety**: Some `any` types still exist in `src/api/client.ts` and `src/hooks/use-api.ts`.
- **Error Handling**: API error states are basic and do not yet handle specific HTTP status codes (401, 403, 500) with custom UI.
