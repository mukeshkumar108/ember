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
- App-level React error boundary fallback.
- Device registration baseline via `POST /api/v1/devices` (with graceful environment fallbacks).

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

## Architecture

```
app/                    Routes and layout wiring only
  (public)/             Auth routes
  (protected)/          Guarded routes + onboarding + tabs

src/
  api/                  request client + API zod schemas + contract parsing helpers
  hooks/                TanStack Query hooks + auth hooks
  components/
    ui/                 Reusable UI primitives
    feedback/           Loading/Error/Empty + AppErrorBoundary
    auth/               Reusable auth screen components
  providers/            Clerk + QueryClient + Toast provider
  styles/               tokens.ts
  lib/                  Shared utility and form schemas
```

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
