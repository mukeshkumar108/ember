# DEVELOPMENT

Practical extension guide for Ember. Use this doc before reading implementation details.

## 1) Add a New Screen

### Goal
Add a new screen without introducing route/business-logic drift.

### Steps
1. Create route file in `app/...` as a thin wrapper.
2. Put real UI/logic in `src/components/...` and `src/hooks/...` as needed.
3. Use `Screen` or `FormScreen` as the outer container.
4. Use existing feedback primitives for async states.

### Example Pattern
```tsx
// app/(protected)/(tabs)/example.tsx
import { ExampleScreen } from '@/components/example';

export default function ExampleRoute() {
  return <ExampleScreen />;
}
```

## 2) Add a New API Hook (Required Boundary Pattern)

### Rule
Backend responses are `unknown` until parsed.

### Steps
1. Add/extend schema in `src/api/schemas.ts`.
2. In hook, call `request<unknown>()`.
3. Parse with `parseApiContract(schema, payload, 'CONTEXT')`.
4. Then apply domain checks (`success`, `data`, etc.).
5. Return parsed data to React Query.

### Example
```ts
const raw = await request<unknown>('/api/v1/example');
const response = parseApiContract(exampleResponseSchema, raw, 'GET /api/v1/example response');

if (!response.success || !response.data) {
  throw new Error(response.error?.message || 'Failed to load example');
}

return response.data;
```

## 3) Add or Extend UI Primitives Safely

### Prefer this order
1. Reuse existing primitive with props.
2. Extend existing primitive minimally.
3. Add new primitive only when repeated use is clear.

### Hard rules
- Keep primitives in `src/components/ui/`.
- Keep product-specific behavior out of primitives.
- Use `tokens` for spacing, color, typography.
- Keep API simple and explicit.

## 4) Form Strategy

### Default
- Use `FormScreen` for input-heavy screens.
- Use `react-hook-form` + `zod` schemas for validation.
- Keep field-level UI with `Input`, `TextArea`, `Select`, `Checkbox`, `Toggle`.

### Error handling
- field errors -> control-level `error`
- server submit errors -> top-level/root form error presentation

## 5) Async and Error UX

### Loading/error states
- Use `LoadingState` and `ErrorState` for query/mutation surfaces.
- Keep messages practical and non-product-specific.

### Render crashes
- `AppErrorBoundary` is mounted in `app/_layout.tsx`.
- It catches render errors and shows a retry fallback.

## 6) Internal Validation Surface (Playground)

Use playground to validate primitives and interaction behavior quickly.

Expected coverage:
- text input + textarea
- select + checkbox + toggle
- button states
- loading/error/empty
- toast + confirm modal + sheet
- async submit lifecycle
- keyboard-safe form behavior

## 7) What to Avoid

- Ad-hoc API parsing in UI components
- Raw `fetch` calls in hooks/components
- New colors/spacing outside `tokens.ts`
- Route files with business logic
- Product-specific copy/flows in foundation primitives

## 8) Deferred by Design

- full timezone dataset/search UI
- advanced modal stacking and gesture framework
- product/domain-specific onboarding or account workflows

## 9) Device Registration Baseline

- Lifecycle owner: `useDeviceRegistration` (called in protected layout).
- Contract: `POST /api/v1/devices`.
- Pattern: `request<unknown>` then `parseApiContract(registerDeviceResponseSchema, ...)`.
- Keep flow non-blocking and idempotent.
- For dev checks, read status from settings developer section.

## 10) Testing Strategy

- Test runner: `vitest` (`pnpm test`).
- Keep tests concentrated on:
  - contract parsing (`src/api/contracts.test.ts`)
  - critical hook boundary behavior (`src/hooks/contracts-hooks.test.ts`)
- Prefer small fixture-driven tests over large integration harnesses.
- Avoid broad visual snapshot and animation-detail testing in this starter.

### Adding another contract test
1. Add a fixture in `src/test/fixtures/api.ts` (or local inline fixture if tiny).
2. Parse with `parseApiContract(schema, payload, context)`.
3. Assert success for valid payloads and `ApiContractError` for drifted payloads.

## 11) Feature Registry Strategy

- Source of truth: `src/features/registry.ts`.
- Add new optional module as a registry key with:
  - `enabled` default
  - short `description`
- Gate optional behavior with `isFeatureEnabled(key)` in hooks/components.
- Keep registry explicit and static; do not build dynamic plugin loaders.

## 12) Offline-Awareness Strategy

- Use `useNetworkStatus` for a single baseline network signal.
- Keep UX minimal (`NetworkBanner`) and non-blocking.
- Do not implement offline-first sync queues or conflict resolution in starter baseline.

## 13) Notification Listener Strategy

- Listener owner: `useNotificationListeners` (protected authenticated lifecycle).
- Default behavior: no product routing, no inbox assumptions.
- Extension point:
  - `setNotificationEventHandlers({ onForegroundNotification, onNotificationResponse })`
  - define product behavior in the consuming app/module layer.

## 14) Image Primitive Strategy

- Use `Image` from `src/components/ui/image.tsx` for remote images.
- Prefer passing `uri` for simple remote sources.
- Optional `blurhash` can be passed when available.
- Keep fallback simple (`fallbackText` + themed fallback surface). Do not create product-specific image wrappers in the starter.

## 15) Social Auth Stub Strategy

- Current social buttons are intentional stubs only (Apple + Google).
- Hooks: `src/hooks/auth/use-social-auth-stubs.ts`.
- Production wiring is product-level work:
  - configure OAuth providers in Clerk
  - wire callback/deep-link handling
  - replace stub errors with real sign-in actions

## 16) Deep Linking Strategy

- Baseline helpers live in `src/config/deep-linking.ts`.
- Runtime listener hook: `src/hooks/use-deep-linking.ts` (wired in `app/_layout.tsx`).
- Use `setDeepLinkHandlers(...)` to plug in product-specific behavior.
- Keep starter-level deep linking generic; avoid embedding product routes in foundation code.
