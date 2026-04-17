# Project Status Report

**Project**: Ember  
**Checkpoint**: Contract Test Baseline (2026-04-17)  
**Maturity**: 1.5.0 foundation

## What Is Solid
- Public/protected routing and Clerk auth are wired.
- Protected bootstrap uses `/api/v1/me` and fails closed on bootstrap errors.
- Onboarding gate and onboarding completion flow are wired through `PATCH /api/v1/me`.
- Account/settings baseline is implemented with editable profile fields and safe fallbacks.
- Reusable UI primitives, feedback states, overlays, and keyboard-safe form pattern are in place.
- Internal playground exists for primitive and interaction validation.
- **API boundary parsing is now runtime-validated with Zod** for active `/api/v1/me` read/write flows.
- **App-level crash handling is now present** via `AppErrorBoundary` in `app/_layout.tsx`.
- **Device registration baseline is implemented**: authenticated lifecycle attempts `POST /api/v1/devices` with validated response parsing and quiet environment fallbacks.
- **Minimal high-value test layer is present**: Vitest contract tests + critical hook boundary tests.

## API Boundary Strategy (Current)
- Backend payloads are requested as `unknown`.
- Payloads are parsed with Zod schemas from `src/api/schemas.ts` using `parseApiContract`.
- Hooks currently using this pattern:
  - `useMe` (`GET /api/v1/me`)
  - `useUpdateMe` (`PATCH /api/v1/me`)
  - `useCompleteOnboarding` (`PATCH /api/v1/me`)
  - `useDeviceRegistration` (`POST /api/v1/devices`)
- Contract drift throws explicit `ApiContractError` with issue details.

## What Is Intentionally Deferred
- Full searchable timezone dataset/picker.
- Advanced overlay orchestration (stacking/queue manager).
- Push delivery workflows and notification-center UX.
- Product-specific onboarding/account behaviors.

## Active Assumptions
- forgingfire keeps `/api/v1/me` envelope shape `{ success, data, error }`.
- `User.onboarding.completed` remains the canonical onboarding guard signal.
- Clerk bearer tokens are valid for forgingfire auth.

## Current Risks
- MFA/SSO-only auth edge cases still surface generic messaging in current auth UX.
- Locale/timezone controls are curated starter options, not exhaustive global pickers.
- Error boundary reset retries render path but does not auto-recover external side effects.
- Expo Go/simulator environments may not provide a usable push token; Ember now reports this as skipped registration.
- Device registration behavior is intentionally not deeply unit-tested due environment complexity; covered primarily through contract tests and runtime status visibility.

## Immediate Next Task
Add one focused hook test around `useDeviceRegistration` skip/fail state transitions using lightweight mocks, only if it remains stable and low-maintenance.
