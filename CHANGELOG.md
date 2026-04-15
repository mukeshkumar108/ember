# Changelog

All notable changes to this project are documented here.

## [Foundation Checkpoint] - 2026-04-15

### Hardening
- **Protected bootstrap guard**: `app/(protected)/_layout.tsx` now fails closed when `/api/v1/me` cannot load, showing explicit retry and sign-out actions instead of silently rendering tabs.
- **API client resilience**: `src/api/client.ts` now uses stricter typing (`unknown` over `any`), safer JSON parsing for empty/non-JSON responses, and conditional `Content-Type` headers.
- **Environment clarity**: API base URL now supports `EXPO_PUBLIC_API_URL` with platform-safe local fallback in `src/config/index.ts`.

### Cleanup
- Removed placeholder unused auth variables from public auth screens and onboarding screen.
- Removed placeholder console logging from `useDeviceRegistration` while keeping the hook as a reserved extension point.
- Cleared current lint warnings.

### Docs
- Updated `AGENTS.md` with explicit API URL/source-of-truth and lint verification requirements.
- Updated `README.md` and `CURRENT_STATE.md` to match actual foundation status and unresolved gaps.

## [Phase 1 Foundation] - 2026-04-15

### Initial Shell Scaffolding
- Routing grouped into `app/(public)` and `app/(protected)` using Expo Router.
- Clerk Expo initialized with SecureStore token cache.
- Typed API client and `useMe` bootstrap hook added.
- Bottom-tab shell and onboarding route group added.
