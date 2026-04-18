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

## Feature Registry Rules
1. Feature toggles/modules are defined in `src/features/registry.ts` as the single source of truth.
2. Prefer adding optional capability behind a feature key before wiring product behavior.
3. Do not build a plugin framework; keep feature registry static and explicit.

## Auth Stub Rules
1. Social auth buttons (Apple/Google) currently represent starter stubs.
2. Keep Apple present when social auth UI is shown to satisfy Apple sign-in expectations.
3. Do not present stubs as fully wired authentication.

## UI and Interaction Rules
1. Use tokens from `src/styles/tokens.ts` for spacing, radius, animation; no ad-hoc values.
2. **Colors must come from `useTheme().colors`** — never read `tokens.colors.*` in components. `tokens.colors` is a light-palette alias for backwards compatibility only.
3. Use existing primitives before creating new ones:
   - `Button`, `Input`, `TextArea`, `Select`, `Checkbox`, `Toggle`
   - `Screen`, `FormScreen`, `Section`, `Card`
   - `Sheet`, `ConfirmModal`, `Toast`
4. Use shared `LoadingState` and `ErrorState` for async UI.
5. Any screen with multiple inputs should use `FormScreen`.
6. Playground must be truthful: controls are interactive unless clearly labeled visual-only.

## Theme and Font Rules
1. Every component that renders color must call `const { colors } = useTheme()` at the top and use `colors.*` for all color values.
2. Split styles into `staticStyles` (layout via `StyleSheet.create`) and inline color objects — never put color values inside `StyleSheet.create`.
3. Use `colors.backgroundElevated` for elevated surfaces (Sheet, ConfirmModal, elevated Card) — not `colors.background`.
4. Use `tokens.typography.fonts.*` for all `fontFamily` values. Do NOT combine with `fontWeight` — the Inter font name encodes the weight.
5. When adding a new color token, add it to **both** `lightColors` and `darkColors` in `src/styles/colors.ts`.
6. `isDark` from `useTheme()` is for exceptional cases only (e.g., WCAG contrast logic that can't be expressed as a token pair). Avoid `isDark` for layout or spacing decisions.

## Error Handling Rules
1. Async errors: surface with shared feedback components.
2. Render crashes: app is wrapped with `AppErrorBoundary` in `app/_layout.tsx`.
3. Keep boundary fallback starter-grade and practical.

## Device Registration Rules
1. `useDeviceRegistration` runs in authenticated protected lifecycle and must stay non-blocking.
2. Handle unsupported environments (simulator/web/missing project ID) gracefully without noisy crashes.
3. Keep registration idempotent and quiet; avoid repeated duplicate posts.
4. Keep settings/dev visibility minimal (status + support/token presence), not a debug console.

## Offline and Notification Baseline Rules
1. Ember is offline-aware, not offline-first. Avoid adding sync/conflict systems in starter baseline.
2. Use `useNetworkStatus` for network awareness and keep banner messaging minimal.
3. Use notification listener extension handlers (`src/features/notifications.ts`) for future product behavior.
4. Do not add product-specific notification routing in starter baseline.

## Deep Linking Rules
1. Use `src/config/deep-linking.ts` as the baseline deep-link helper and handler registry.
2. Keep deep-link baseline generic (initial URL + URL listener). Product flows must attach handlers explicitly.
3. Avoid hardcoded product route assumptions in starter-level deep-link wiring.

## Image Primitive Rules
1. Prefer `src/components/ui/image.tsx` over raw image usage for remote images.
2. Keep fallback behavior simple (placeholder + error fallback) and reusable.

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
4. For architecture baselines, add tests for small pure helpers (feature flags, readiness/mapping helpers) instead of brittle runtime harnesses.
5. Avoid brittle environment-heavy mocks unless they provide clear value.

## Required Handover Format
1. Files added/removed/renamed.
2. Key logic changes.
3. Assumptions made.
4. Unresolved risks.
5. Next step.
6. Verification run outcomes.
