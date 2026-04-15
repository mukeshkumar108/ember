# Changelog

All notable changes to this project will be documented in this file.

## [Phase 1 Foundation] - 2026-04-15

### Initial Shell Scaffolding
- **Routing**: Grouped `app/` into `(public)` and `(protected)` with Expo Router.
- **Authentication**: Initialized `Clerk Expo` and `expo-secure-store` integration.
- **API Foundation**: Implemented a typed `request` client in `src/api/client.ts` that automatically attaches Clerk tokens.
- **User State**: Added `useMe` hook to fetch and guard routes based on `/api/v1/me`.
- **UI Primitives**: Established a library of basic, themed components in `src/components/ui/`.
- **Infrastructure**: Configured `tsconfig.json` with `@/*` aliases for all internal logic.

### Unverified Assumptions (Warning)
- **Backend DTO**: The current `User` model (`src/hooks/use-me.ts`) is a **placeholder assumption** and has not been verified against the `forgingfire` backend.
- **Endpoint Availability**: The app assumes the backend endpoints exist and follow RESTful naming conventions.
- **Onboarding Logic**: The redirection logic in `app/(protected)/_layout.tsx` is speculative and requires live testing.

### Deferred for Implementation
- **Functional Auth Forms**: `sign-in.tsx` and `sign-up.tsx` currently only show placeholder text.
- **Account Deletion**: Only a UI placeholder button is present.
- **Push Notification Token Sync**: A `useDeviceRegistration` hook placeholder is provided but is functionally empty.
