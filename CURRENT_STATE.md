# Project Status Report

**Project**: Ember  
**Checkpoint**: Extension Baseline Consolidation (2026-04-17)  
**Maturity**: 1.6.0 foundation

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
- **Feature extension baseline is implemented**: lightweight feature registry for optional module gating.
- **Offline-awareness baseline is implemented**: network status hook plus global offline banner.
- **Notification listener baseline is implemented**: foreground and response listeners with explicit extension handlers.

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
- Offline-first sync queues, local mutation replay, and conflict resolution.
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
- Offline status cannot guarantee backend reachability in every captive/network-edge case; it is a practical baseline signal.

## Immediate Next Task
Add one thin product-level module example (behind registry key) to demonstrate end-to-end feature enable/disable workflow without adding domain logic.
