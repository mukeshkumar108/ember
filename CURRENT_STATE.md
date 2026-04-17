# Project Status Report

**Project**: Ember  
**Checkpoint**: Data-Boundary + Docs Hardening (2026-04-17)  
**Maturity**: 1.3.0 foundation

## What Is Solid
- Public/protected routing and Clerk auth are wired.
- Protected bootstrap uses `/api/v1/me` and fails closed on bootstrap errors.
- Onboarding gate and onboarding completion flow are wired through `PATCH /api/v1/me`.
- Account/settings baseline is implemented with editable profile fields and safe fallbacks.
- Reusable UI primitives, feedback states, overlays, and keyboard-safe form pattern are in place.
- Internal playground exists for primitive and interaction validation.
- **API boundary parsing is now runtime-validated with Zod** for active `/api/v1/me` read/write flows.
- **App-level crash handling is now present** via `AppErrorBoundary` in `app/_layout.tsx`.

## API Boundary Strategy (Current)
- Backend payloads are requested as `unknown`.
- Payloads are parsed with Zod schemas from `src/api/schemas.ts` using `parseApiContract`.
- Hooks currently using this pattern:
  - `useMe` (`GET /api/v1/me`)
  - `useUpdateMe` (`PATCH /api/v1/me`)
  - `useCompleteOnboarding` (`PATCH /api/v1/me`)
- Contract drift throws explicit `ApiContractError` with issue details.

## What Is Intentionally Deferred
- `POST /api/v1/devices` registration (`useDeviceRegistration` is still no-op).
- Full searchable timezone dataset/picker.
- Advanced overlay orchestration (stacking/queue manager).
- Product-specific onboarding/account behaviors.

## Active Assumptions
- forgingfire keeps `/api/v1/me` envelope shape `{ success, data, error }`.
- `User.onboarding.completed` remains the canonical onboarding guard signal.
- Clerk bearer tokens are valid for forgingfire auth.

## Current Risks
- MFA/SSO-only auth edge cases still surface generic messaging in current auth UX.
- Locale/timezone controls are curated starter options, not exhaustive global pickers.
- Error boundary reset retries render path but does not auto-recover external side effects.

## Immediate Next Task
Implement `POST /api/v1/devices` with boundary parsing and expose minimal registration status in settings dev section.
