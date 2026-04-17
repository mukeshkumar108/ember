# Ember Contributor Guide (Operational)

This file is the source of truth for human and agent contributors working in Ember.

## Repo Purpose
Ember is a reusable Expo / React Native foundation for forgingfire-backed apps.
It is not a product and should stay domain-agnostic.

## Core Architecture Rules
1. `app/` is for Expo Router routes and layout wiring only.
2. `src/` is for reusable logic, hooks, API boundary code, components, config, and styles.
3. Do not place product business logic in route files.
4. Do not redesign repo structure unless there is a concrete bug or scaling blocker.

## API and Data-Boundary Rules
1. Never use raw `fetch` directly; always go through `request` from `src/api/client.ts` via `useApi`.
2. Treat backend payloads as `unknown` first.
3. Parse payloads with Zod at the API boundary before UI state uses them.
4. Current parser pattern:
   - schemas: `src/api/schemas.ts`
   - parser: `src/api/validation.ts` (`parseApiContract`)
   - usage: `request<unknown>()` -> `parseApiContract(schema, payload, context)` -> business checks
5. If parsing fails, let it fail loudly (`ApiContractError`) so backend drift is visible immediately.
6. Device registration (`POST /api/v1/devices`) must use the same `request<unknown> -> parseApiContract(...)` boundary pattern.

## UI and Interaction Rules
1. Use tokens from `src/styles/tokens.ts`; no ad-hoc colors or spacing.
2. Use existing primitives before creating new ones:
   - `Button`, `Input`, `TextArea`, `Select`, `Checkbox`, `Toggle`
   - `Screen`, `FormScreen`, `Section`, `Card`
   - `Sheet`, `ConfirmModal`, `Toast`
3. Use shared `LoadingState` and `ErrorState` for async UI.
4. Any screen with multiple inputs should use `FormScreen`.
5. Playground must be truthful: controls are interactive unless clearly labeled visual-only.

## Error Handling Rules
1. Async errors: surface with shared feedback components.
2. Render crashes: app is wrapped with `AppErrorBoundary` in `app/_layout.tsx`.
3. Keep boundary fallback starter-grade and practical.

## Device Registration Rules
1. `useDeviceRegistration` runs in authenticated protected lifecycle and must stay non-blocking.
2. Handle unsupported environments (simulator/web/missing project ID) gracefully without noisy crashes.
3. Keep registration idempotent and quiet; avoid repeated duplicate posts.
4. Keep settings/dev visibility minimal (status + support/token presence), not a debug console.

## Out of Scope
- Product-specific features
- Analytics/marketing systems
- Heavy design systems or global state engines
- Overly abstract UI frameworks

## Delivery Discipline
- Keep edits surgical and task-scoped.
- Prefer boring, readable code over clever abstractions.
- Run verification before handoff:
  - `pnpm test` (for boundary/hook changes)
  - `pnpm lint`
  - `pnpm exec tsc --noEmit`

## Testing Rules
1. Prioritize contract/boundary tests over broad UI snapshots.
2. Add tests where backend drift would silently break starter behavior.
3. Keep hook tests focused on unwrapping, error propagation, and cache invalidation behavior.
4. Avoid brittle environment-heavy mocks unless they provide clear value.

## Required Handover Format
1. Files added/removed/renamed.
2. Key logic changes.
3. Assumptions made.
4. Unresolved risks.
5. Next step.
6. Verification run outcomes.
