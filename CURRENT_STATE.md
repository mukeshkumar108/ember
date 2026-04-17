# Project Status Report

**Project**: Ember Shell
**Checkpoint**: Form Foundation (2026-04-17)
**Maturity**: 1.2.0

---

## What Is Solid

### Foundation
- **Routing shell**: Public and protected route groups are wired and stable.
- **Auth wiring**: Clerk Provider + SecureStore token cache are in place.
- **Public auth flow**: Email/password sign-in and sign-up with conditional verification.
- **Bootstrap contract**: `/api/v1/me` typed and unwrapped via `useMe`.
- **Onboarding flow**: completes via `PATCH /api/v1/me` and routes into tabs.
- **Protected guard**: fails closed on bootstrap failure with retry/sign-out.
- **Account/Settings**: editable profile fields with `PATCH /api/v1/me`, `Toast` feedback, and `isDirty` save guard.
- **Form foundation**: `react-hook-form` + `zod` integrated. All auth and profile forms use the standard pattern. Shared schemas in `src/lib/schemas.ts`. See `FORM_PATTERNS.md`.

### Design System (v2)
- **Token system**: Comprehensive `tokens.ts` — colors (primary #007AFF, semantic variants), spacing (4–64), radius (full pill support), typography (xs–3xl with lineHeight multipliers), shadow presets, animation duration/spring constants.
- **Icon system**: `lucide-react-native` throughout. `Icon` wrapper component. Tab bar uses Lucide icons with active/inactive stroke weights.
- **Component library** (all in `src/components/ui/`):
  - Layout: `Screen` (header, scroll, keyboardAware), `FormScreen`, `Section`, `Card`/`PressableCard`, `Divider`
  - Inputs: `Input` (focus ring), `TextArea`, `Select` (native ActionSheet iOS), `Checkbox` (Reanimated + haptics), `Toggle` (haptics)
  - Actions: `Button` (primary/secondary/danger/ghost, sm/md/lg, haptics)
  - Display: `Avatar`, `Badge`, `ListItem`, `Icon`, `Skeleton`/`SkeletonListItem`
  - Overlays: `Sheet` (Reanimated 4, spring, swipe-to-dismiss handle), `ConfirmModal` (Reanimated spring, side-by-side buttons), `Toast` (Reanimated 4, types: info/success/warning/error)
- **Feedback**: `LoadingState`, `ErrorState` (icon-based), `EmptyState` (optional Lucide icon)
- **Animations**: Reanimated 4 used for Sheet, Toast, ConfirmModal, Checkbox. `react-native-gesture-handler` used for Sheet swipe handle.

### Bug Fixes Applied
- Sheet animation was 24px twitch → now proper off-screen spring entry (600px start)
- Toast animation had same bug → fixed
- Playground inputs hidden by keyboard → `Screen` now has `keyboardAware` prop; playground uses it
- Input had no focus state → primary-blue border ring on focus
- Section titles competed with page titles → now iOS-style small-caps section headers

---

## What Is Intentionally Placeholder
- `app/(protected)/onboarding/index.tsx` — single completion action, no multi-step product flow.
- Delete account — UI only, backend delete semantics deferred.
- `src/hooks/use-device-registration.ts` — reserved, currently no-op.
- `@shopify/react-native-skia` — installed for future canvas/visual features, not yet used.

---

## Active Assumptions
- Backend serves `GET /api/v1/me` at `${EXPO_PUBLIC_API_URL}/api/v1/me`.
- `User.onboarding.completed` is the canonical onboarding guard field.
- Clerk tokens are accepted by forgingfire as Bearer auth.

---

## Current Risks
- **Sign-in edge paths**: MFA/SSO-only accounts get a generic message.
- **Sheet gesture inside Modal**: Swipe-to-dismiss on the handle works; full-sheet swipe may not fire reliably inside RN Modal on all Android versions. Upgrade path: portal-based sheet.
- **Profile validation UX**: locale/timezone use curated starter lists, not searchable pickers.
- **Dark mode**: token structure is ready (single palette object) but dark mode variants are not yet implemented.

---

## Immediate Next Tasks
1. Implement `POST /api/v1/devices` in `useDeviceRegistration`.
2. Add dark mode support — token system is ready, needs a `useColorScheme`-aware token provider.
3. Productize onboarding (multi-step flow, real fields — now can use the form foundation).
4. Add zod runtime parsing to API responses (currently using TS interfaces only, no runtime guarantee).
