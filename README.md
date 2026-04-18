# Ember

Ember is a reusable Expo / React Native starter that pairs with the forgingfire backend.
It is not a product. It is a practical app shell for future mobile experiments.

## Ember Philosophy
- Keep `app/` routing-focused and thin.
- Keep `src/` reusable and logic-focused.
- Prefer boring, explicit patterns over abstraction-heavy systems.
- Fail closed on auth/bootstrap issues.
- Validate backend responses at the boundary before UI consumes data.

## What Ember Includes
- Clerk auth with public/protected routing.
- Protected bootstrap via `GET /api/v1/me`.
- Onboarding gate + completion flow via `PATCH /api/v1/me`.
- Reusable UI primitives and feedback components.
- Form primitives and keyboard-safe form screen pattern.
- Overlay primitives: sheet, confirm modal, toast.
- Image primitive based on `expo-image` with placeholder and fallback handling.
- App-level React error boundary fallback.
- Device registration baseline via `POST /api/v1/devices` (with graceful environment fallbacks).
- Lightweight feature registry for optional module gating.
- Offline-awareness baseline with network status hook + offline banner.
- Notification listener baseline (foreground + tap-response extension points).
- Social auth UI stubs for Apple + Google (intentionally not fully wired).
- Deep-linking baseline with scheme helpers and listener hooks.

## Quick Start

### 1. Install

```bash
pnpm install
```

### 2. Configure env

```bash
cp .env.example .env
```

Required env:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://localhost:3001
```

Android emulator local backend example:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001
```

### 3. Run

```bash
pnpm ios
pnpm android
pnpm start
```

### 4. Test

```bash
pnpm test
```

## Architecture

```
app/                    Routes and layout wiring only
  (public)/             Auth routes
  (protected)/          Guarded routes + onboarding + tabs

src/
  api/                  request client + API zod schemas + contract parsing helpers
  config/               runtime config + deep-link helpers
  features/             feature registry + extension module hooks
  hooks/                TanStack Query hooks + auth hooks
  components/
    ui/                 Reusable UI primitives
    feedback/           Loading/Error/Empty + AppErrorBoundary
    auth/               Reusable auth screen components
  providers/            Clerk + QueryClient + Toast provider
  styles/               tokens.ts
  lib/                  Shared utility and form schemas
```

## Image Primitive Baseline

Use `Image` from `src/components/ui/image.tsx` for app images:
- supports remote `uri` or explicit `source`
- default blurhash placeholder (or custom `blurhash`)
- error fallback surface/text

This should be the default image surface for new screens unless there is a specific reason to use raw `expo-image`.

## Social Auth Stubs (Apple + Google)

Auth screens include:
- `Continue with Apple (Stub)`
- `Continue with Google (Stub)`

These are intentionally non-production placeholders to preserve starter structure and Apple compliance expectations.
Complete wiring at product integration time via Clerk OAuth strategy setup.

## Deep Linking Baseline

Baseline pieces:
- `src/config/deep-linking.ts` (`createAppDeepLink`, handler registry)
- `src/hooks/use-deep-linking.ts` (initial URL + runtime URL listener)
- wired in `app/_layout.tsx`

Current baseline scope:
- scheme-aware link creation (`ember://...`)
- initial URL + URL event extension points

Product-level implementations should attach behavior via `setDeepLinkHandlers(...)`.

## Data-Boundary Pattern (Required)

All backend responses must be treated as `unknown` until parsed:

1. Call `request<unknown>(...)`
2. Parse using `parseApiContract(schema, payload, context)`
3. Only then unwrap business fields (`success`, `data`, etc.)

Current key schemas:
- `src/api/schemas.ts`
  - `meResponseSchema`
  - `userSchema`
  - `registerDeviceResponseSchema`

Parser helper:
- `src/api/validation.ts`
  - `parseApiContract`
  - `ApiContractError`

## Device Registration Baseline

Ember performs quiet authenticated device registration from `useDeviceRegistration`:
- requests notification permission where supported
- obtains Expo push token when available
- sends `POST /api/v1/devices` with `{ platform, pushToken, appVersion? }`
- validates response with `registerDeviceResponseSchema`
- caches recent successful registration to avoid noisy repeated posts

This flow is non-blocking: failure or unsupported environment does not break app startup.

### Environment caveats
- Simulator/emulator and some Expo Go environments cannot provide a real push token.
- Missing EAS project ID prevents Expo push token retrieval.
- Web registration is currently skipped in Ember baseline.

## Feature Extension Baseline

Single source of truth:
- `src/features/registry.ts`

Current baseline features:
- `notifications` (default enabled)
- `offlineAwareness` (default enabled)
- reserved disabled slots: `analytics`, `uploads`, `payments`, `subscriptions`, `multiStepOnboarding`

Use `isFeatureEnabled('<featureKey>')` in hooks/components for safe conditional behavior.

## Offline Awareness Baseline

- `useNetworkStatus` provides reusable online/offline state.
- `NetworkBanner` is mounted at app layout level and shows a minimal offline warning.
- Ember is **offline-aware**, not offline-first: no full sync/conflict strategy is implemented.

## Notification Listener Baseline

- `useNotificationListeners` is wired in protected lifecycle.
- Foreground and response-tap listeners are attached when supported/authenticated.
- Extension point lives in `src/features/notifications.ts`:
  - `setNotificationEventHandlers(...)`
  - `getNotificationEventHandlers()`
- No product routing, inbox, or notification center assumptions are made by default.

## Error Handling

- Route/bootstrap async failures: use shared `LoadingState` / `ErrorState`.
- Render-time crashes: `AppErrorBoundary` wraps app content in `app/_layout.tsx`.
- In dev, boundary fallback shows error message for faster diagnosis.

## Internal Validation Surface

Use the internal playground route to validate primitives and interactions:
- Buttons, inputs, textarea, select, checkbox, toggle
- Loading/error/empty states
- Toast, confirm modal, sheet
- Async submit lifecycle
- Keyboard-safe form demo route

## Testing (Minimal High-Value Layer)

Stack:
- `vitest`

Current focus:
- API contract parsing tests for `/api/v1/me` and `/api/v1/devices`
- critical hook boundary behavior tests (`useMe`, `useUpdateMe`, `useCompleteOnboarding`)
- feature registry and extension baseline helpers
- offline-awareness mapping logic
- notification listener readiness logic
- deep-link config helper behavior

Intentionally not a goal:
- large visual snapshot suites
- animation detail tests
- broad coverage chasing

## Documentation Map

- `README.md`: high-level overview and operational constraints
- `DEVELOPMENT.md`: docs-first extension recipes (new screen, new API hook, component extension)
- `AGENTS.md`: contributor/agent operational rules and guardrails
- `CURRENT_STATE.md`: honest status, assumptions, and known risks
- `CHANGELOG.md`: incremental change history

## Non-Goals (Intentionally Deferred)

- Product/domain features
- Analytics and unrelated systems
- Complex overlay manager / modal stacking framework
- Heavy theme engine
- Full searchable timezone dataset
