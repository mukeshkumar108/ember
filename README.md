# Ember Shell

A premium, product-agnostic mobile starter template for the [forgingfire](https://github.com/forgingfire) backend. Fork this to start any new mobile product without rebuilding the foundation.

**What you get out of the box:**
- Clerk email/password auth (sign-in, sign-up, verification) wired end-to-end
- Protected/public routing with onboarding guard
- Authenticated API client + TanStack Query bootstrap
- Full UI component library with iOS-grade polish (see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md))
- Lucide icon system throughout
- Reanimated 4 animations (Sheet, Toast, Checkbox, ConfirmModal)
- Settings screen with profile editing and toast feedback
- Sheet, ConfirmModal, and Toast overlay patterns

---

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd ember
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...   # from clerk.com dashboard
EXPO_PUBLIC_API_URL=http://localhost:3001        # forgingfire backend
```

For Android emulator connecting to local backend:
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001
```

### 3. Run

```bash
pnpm ios        # iOS simulator
pnpm android    # Android emulator
pnpm start      # Expo Go / device
```

---

## Starting a New Project from This Template

1. Change `name` and `slug` in `app.json`
2. Add `ios.bundleIdentifier` and `android.package` in `app.json`
3. Update `primary` color in `src/styles/tokens.ts` to your brand color
4. Replace app icons in `src/assets/images/`
5. Update `version` in `package.json` and `app.json`
6. Point `EXPO_PUBLIC_API_URL` at your backend

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the full token and component reference.

---

## Architecture

```
app/                    Expo Router routes and layouts only. No logic.
  (public)/             Unauthenticated screens (sign-in, sign-up)
  (protected)/          Authenticated screens (guarded by Clerk + /me bootstrap)
    (tabs)/             Bottom tab shell (Home, Explore, Settings)
    onboarding/         Onboarding gate

src/
  api/                  Typed fetch client + DTOs
  components/
    auth/               Auth screen components (logic lives in hooks/auth/)
    feedback/           LoadingState, ErrorState, EmptyState
    ui/                 UI component library — the design system
  config/               App-level config (API URL, Clerk key)
  hooks/                TanStack Query hooks and local state
  lib/                  Shared utilities (formatting, etc.)
  providers/            AppProviders (Clerk, QueryClient, Toast)
  styles/
    tokens.ts           Design token source of truth — single source of truth
```

**Rules:**
- `app/` — routing and layouts only, zero business logic
- `src/api/` — `request()` helper only, never raw `fetch`
- `src/styles/tokens.ts` — no ad-hoc colors, spacing, or font sizes anywhere else
- `src/components/ui/` — stateless primitives only

---

## UI Component Library

| Category | Components |
|---|---|
| Layout | `Screen`, `FormScreen`, `Section`, `Card`, `PressableCard`, `Divider` |
| Inputs | `Input`, `TextArea`, `Select`, `Checkbox`, `Toggle` |
| Actions | `Button` (primary / secondary / danger / ghost · sm / md / lg) |
| Display | `Avatar`, `Badge`, `ListItem`, `Icon`, `Skeleton`, `SkeletonListItem` |
| Overlays | `Sheet`, `ConfirmModal`, `Toast` / `useToast` |
| Feedback | `LoadingState`, `ErrorState`, `EmptyState` |

Full reference: **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**

---

## Internal UI Playground

Navigate: **Settings → Developer → Open UI Playground** (dev builds only).

Validates every primitive interactively — all button variants, inputs, select, checkbox, toggle, card variants, badge, avatar, skeleton, list items, dividers, toast, sheet, confirm modal, and the async submit lifecycle.

---

## Auth Behavior

- Sign-in via Clerk `useSignIn` + `setActive`.
- Sign-up via Clerk `useSignUp` + `setActive`.
- Email verification is **conditional** — only triggered when Clerk signals unverified email fields. Not hardcoded.
- `useDeviceRegistration` hook is wired and no-op. Wire `expo-notifications` when push is needed.

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `expo-router` | File-based routing |
| `@clerk/clerk-expo` | Auth |
| `@tanstack/react-query` | Server state |
| `react-native-reanimated` | UI-thread animations |
| `react-native-gesture-handler` | Gesture recognition |
| `lucide-react-native` | Icon system |
| `react-native-svg` | SVG renderer (lucide peer) |
| `expo-haptics` | Tactile feedback |
| `@shopify/react-native-skia` | Canvas / 2D graphics (reserved) |
| `zod` | API response validation |

---

## Operational Docs

| Doc | Purpose |
|---|---|
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | **Start here.** Token reference, component API, patterns, how to customize |
| [AGENTS.md](./AGENTS.md) | Architecture rules and AI agent handover format |
| [CURRENT_STATE.md](./CURRENT_STATE.md) | Honest current status, risks, and next tasks |
| [CHANGELOG.md](./CHANGELOG.md) | Incremental checkpoint history |
