# START HERE

Ember is a **premium, product-agnostic mobile starter** for apps that use the **forgingfire** backend.

This repo is **not a product**.
It is a **foundation**.

Its job is to solve the recurring mobile app problems once, properly, so new projects can start fast without rebuilding core infrastructure.

---

## What Ember already solves

Ember already includes:

- Clerk auth baseline
  - sign-in
  - sign-up
  - verification flow
  - social auth stubs
- Public / protected routing
- Onboarding guard
- Authenticated `/api/v1/me` bootstrap
- Runtime API contract validation with Zod
- Form system with `react-hook-form` + `zod`
- UI component library
- Dark mode
- Inter font system
- Offline-awareness baseline
- Device registration baseline
- Notification listener baseline
- Image primitive baseline
- Deep-link baseline
- Error boundary
- Contract tests / hook tests
- Extensive docs

If you are rebuilding any of the above in a new app, stop and fix Ember instead.

---

## Ember philosophy

Ember is built around one rule:

> **If you would rebuild it in the next app, it is not done yet.**

That means Ember favors:

- boring, dependable patterns
- strong defaults
- explicit documentation
- runtime validation
- reusable primitives
- clear extension points

It avoids:

- product-specific business logic
- giant framework abstractions
- dead demo code
- ad hoc styling
- hidden magic

---

## Non-negotiable rules

These rules are mandatory.

### API / data

- Never use raw `fetch` directly in screens/components.
- Always go through the Ember API layer.
- Never pass unparsed API payloads into UI/query state.
- Always use the established `request<unknown> -> parseApiContract(...)` boundary pattern.

### Forms

- Never manage serious form state manually with ad hoc `useState`.
- Use Ember’s standard form pattern:
  - `react-hook-form`
  - `zod`
  - `Controller`
  - shared primitives

See `FORM_PATTERNS.md`.

### Styling / theming

- Never hardcode colors in components.
- Always use `useTheme().colors` for color values.
- `tokens.ts` is the source of truth for spacing, radius, typography, shadows, and animation.
- Colors live in the theme system, not inside components.

See `DESIGN_SYSTEM.md`.

### Component usage

- Prefer existing UI primitives before creating new ones.
- If a missing primitive will be reused across apps, add it to Ember.
- Do not create product-specific one-off components in Ember.

### Architecture

- `app/` is for routing and layouts only.
- Reusable logic belongs in `src/`.
- Optional feature behavior should go through the feature registry / extension model.

---

## Core architecture map

### `app/`

Expo Router routes and layouts only.

- `app/(public)` → unauthenticated screens
- `app/(protected)` → authenticated area
- `app/(protected)/onboarding` → onboarding gate
- `app/(protected)/(tabs)` → tab shell

Do not put business logic here.

### `src/api`

- request helper
- response validation
- schemas
- DTO boundary logic

### `src/components/ui`

Reusable primitives only.

Examples:

- Button
- Input
- TextArea
- Select
- Checkbox
- Toggle
- Card
- Section
- Screen
- FormScreen
- Sheet
- ConfirmModal
- Toast
- Image
- Avatar
- Badge
- ListItem
- Divider
- Skeleton

### `src/components/feedback`

Shared UX states:

- LoadingState
- ErrorState
- EmptyState
- NetworkBanner
- AppErrorBoundary

### `src/hooks`

Reusable hooks and app logic.

Examples:

- `useMe`
- `useUpdateMe`
- `useCompleteOnboarding`
- `useDeviceRegistration`
- `useNotificationListeners`
- `useNetworkStatus`

### `src/features`

Optional extension model / feature registry.

Use this for capabilities like:

- notifications
- analytics
- uploads
- payments
- subscriptions
- multi-step onboarding

### `src/styles`

Design tokens and theme data.

### `src/providers`

Top-level app providers:

- Clerk
- Query client
- Toast
- Theme provider

---

## Docs map

Read docs in this order if you are new:

### 1. `README.md`

High-level repo overview.

### 2. `CURRENT_STATE.md`

Current truth:

- what exists
- what is stable
- what is deferred
- immediate next work

### 3. `DEVELOPMENT.md`

How to extend Ember safely.

Read this before adding:

- new screens
- new hooks
- new features
- new API boundaries

### 4. `DESIGN_SYSTEM.md`

Visual system, component library, theme rules, tokens.

### 5. `FORM_PATTERNS.md`

The standard Ember form strategy.

### 6. `AGENTS.md`

Hard contributor rules and guardrails.

### 7. `APPLE_COMPLIANCE.md`

Accessibility and Apple approval baseline.

### 8. `CHANGELOG.md`

Checkpoint history.

---

## How to extend Ember safely

### Add a new screen

Use:

- existing route structure in `app/`
- existing primitives
- existing form pattern
- existing API boundary pattern

Do not invent new patterns if Ember already has one.

### Add a new form

Use:

- `react-hook-form`
- `zod`
- `Controller`
- shared primitives

Do not build custom ad hoc form wiring.

### Add a new backend endpoint

Mirror the existing Ember pattern:

1. define schema
2. request `unknown`
3. parse with `parseApiContract(...)`
4. expose through hook / mutation
5. update docs if this is foundational

### Add a new optional feature

Use the feature registry.
Do not hard-wire future product features into the base starter without a clear reason.

---

## What Ember intentionally does NOT include

These are intentionally not fully built into the baseline:

- payments provider wiring
- subscription provider wiring
- analytics vendor wiring
- uploads backend/provider wiring
- notification center UI
- product-specific deep-link routing
- full offline-first sync
- product-specific onboarding logic
- domain-specific models

If a future app needs these, either:

- build them as optional feature modules, or
- build them in the product and upstream only the reusable parts

---

## When to improve Ember vs. when to move on

Improve Ember when:

- the thing will be reused in most future apps
- the current primitive/pattern is weak enough that you’d rebuild it next time
- docs are unclear enough that a future model/human would drift

Move on to the product when:

- the foundation already solves the problem cleanly
- the remaining work is product-specific
- the change is mostly branding or product UX, not starter infrastructure

---

## New project bootstrap checklist

When starting a new app from Ember:

1. Fork / clone Ember
2. Update app name / slug in `app.json`
3. Add bundle identifiers / package names
4. Set environment variables
5. Point `EXPO_PUBLIC_API_URL` at the correct backend
6. Update theme tokens / brand-level values as needed
7. Replace icons / splash assets
8. Confirm:
   - auth works
   - `/me` bootstrap works
   - onboarding works
   - settings save works
   - deep links baseline works
   - device registration behaves as expected
9. Build product-specific features on top of Ember patterns

---

## Definition of done for starter-grade work

A component, hook, or pattern is only complete if:

- it behaves correctly on device
- it follows native expectations where appropriate
- it is reusable without redesign in the next app
- it would not need reimplementation in the next app
- it is documented clearly enough that future humans or weaker models can use it safely

If it fails that test, it is not done.

---

## Final reminder

Ember is here to eliminate repeated work.

Do not turn it into:

- a junk drawer
- a product
- a place for one-off hacks

Use it to solve the recurring problems once, properly.
