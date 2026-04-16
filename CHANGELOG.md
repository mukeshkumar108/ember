# Changelog

All notable changes to this project are documented here.

## [Design System v2 — Premium Overhaul] - 2026-04-16

### Breaking / Token Changes
- **Color palette redesigned** — `primary` changed from near-black `#1F2937` to iOS system blue `#007AFF`. All buttons, toggles, focus rings, and active states now use blue.
- **`muted` refined** — now `#8E8E93` (iOS tertiary label). Used strictly for placeholders, hints, and disabled text.
- **New semantic colors**: `foregroundSecondary` (#636366), `border` (#E5E5EA), `backgroundSecondary` (#F2F2F7), `success` (#34C759), `warning` (#FF9500), `overlay` (rgba).
- `danger` updated to `#FF3B30` (iOS system red).
- Component borders now use `border` token instead of the old `muted` token.

### New Tokens
- `spacing['2xl']` (32), `spacing['3xl']` (48), `spacing['4xl']` (64)
- `radius.xl` (20), `radius.full` (9999)
- `typography.sizes.xs` (11), `typography.sizes['2xl']` (28), `typography.sizes['3xl']` (34)
- `typography.weights.semibold` ('600')
- `typography.lineHeights` — `tight`, `normal`, `relaxed` multipliers
- `shadow.sm`, `shadow.md`, `shadow.lg` — spreads directly onto style objects
- `animation.duration.fast/base/slow`, `animation.spring` — all hardcoded timings removed from components

### New Dependencies
- `lucide-react-native` — clean, consistent icon system replacing SF Symbols + MaterialIcons for cross-platform UI
- `react-native-svg` — required peer for lucide-react-native

### New Primitives
- **`Icon`** — thin wrapper around `lucide-react-native`; use instead of ad-hoc icon imports
- **`Avatar`** — initials-based with hash-derived background color and optional image URI
- **`Badge`** — colored pill for status/counts; variants: `primary`, `success`, `warning`, `danger`, `neutral`
- **`Divider`** — horizontal/vertical line separator with optional `label` prop for "or" dividers
- **`ListItem`** — icon + title + subtitle + trailing slot with press state; the standard row for settings and list screens
- **`Skeleton`** — Reanimated pulse animation; `shape: 'rect' | 'circle' | 'text'`. `SkeletonListItem` convenience composite.
- **`PressableCard`** — tappable Card variant with press state

### Upgraded Components
- **`Button`** — added `ghost` variant (transparent, primary-text); `size` prop (`sm | md | lg`); haptic feedback on all press events
- **`Input`** — focus state: border turns primary-blue on focus. Added `hint` prop. Border uses `border` token
- **`TextArea`** — inherits Input focus state; added `lineHeight` token-based spacing
- **`Checkbox`** — replaced `✓` text with Lucide `Check` icon; Reanimated scale bounce animation on toggle; haptics
- **`Toggle`** — haptic feedback on value change; uses `border` token for inactive track
- **`Select`** — iOS: uses native `ActionSheetIOS` (no more custom overlay on iOS); Android: Sheet-based picker retained. Lucide `ChevronDown` icon replaces text char
- **`Sheet`** — fully rewritten with Reanimated 4; starts 600px off-screen and springs in (not 24px twitch). Swipe handle for gesture-based dismiss. `tokens.shadow.lg` on panel
- **`Toast`** — fully rewritten with Reanimated 4; slides up from off-screen. Added `warning` type
- **`ConfirmModal`** — Reanimated spring entry animation; buttons now side-by-side (Cancel | Confirm) matching iOS alert pattern
- **`Card`** — `variant` prop: `default` (backgroundSecondary fill), `elevated` (white + shadow), `outlined` (border only)
- **`Section`** — section titles are now small-caps uppercase labels (11px, letter-spaced) instead of 24px page titles
- **`Screen`** — added `header` prop for Large Title; added `keyboardAware` prop (wraps in `KeyboardAvoidingView`)
- **`FormScreen`** — footer wrapped in `SafeAreaView` bottom edge for home-indicator devices; subtitle uses `foregroundSecondary`

### Bug Fixes
- **Sheet animation** — was barely 24px twitch, now proper full off-screen spring entry
- **Toast animation** — same 24px bug fixed; now slides from below viewport
- **Playground keyboard** — `Screen` now has `keyboardAware` prop; playground passes it, so inputs push up when keyboard opens
- **Input border** — was `muted` (text gray), now `border` (separator gray) — visually distinct from label text
- **Section titles** — previously competed visually with page titles; now iOS-style section headers

### Settings Screen
- Account rows use `ListItem` instead of custom row styles
- First/Last name fields rendered side-by-side
- Save feedback now uses `Toast` instead of inline `saveNotice` text
- Log Out / Delete Account use `ListItem` (cleaner than full-width buttons)

### Tab Bar
- Replaced SF Symbols / MaterialIcons with Lucide icons (`Home`, `Compass`, `Settings`)
- Active icon stroke increases to 2.25 for emphasis
- Label font is now `xs` (11px) with letter spacing

---

## [Foundation v1 Completion] - 2026-04-16

### Added
- UI control primitives: `TextArea`, `Select`, `Checkbox`, and `Toggle`.
- Overlay/feedback primitives: `ConfirmModal`, `ToastProvider`, and `useToast`.

### Improved
- Playground now serves as a practical interactive validation surface for controls, states, sheet, confirm modal, toast, and async submit lifecycle.
- Settings/profile now uses more sensible controls: `TextArea` for bio and `Select` for locale/timezone.
- `Sheet` presentation/motion baseline improved with custom animated entrance/exit and stronger visual framing.
- App providers now include global toast support for lightweight snackbar feedback.

## [Foundation v1 Interaction + Account Baseline] - 2026-04-16

### Added
- `FormScreen` primitive (`src/components/ui/form-screen.tsx`) for keyboard-safe form layouts.
- `Sheet` primitive (`src/components/ui/sheet.tsx`) as a reusable modal/overlay baseline.
- `useUpdateMe` mutation hook for `PATCH /api/v1/me`.
- Reusable settings account module (`src/components/account/settings-screen.tsx`) with profile update support.
- Internal playground keyboard-safe form route (`app/(protected)/(tabs)/playground-form.tsx`).

### Improved
- Sign-in and sign-up screens now use `FormScreen` as the default Ember form pattern.
- Protected bootstrap layout now uses shared `LoadingState` and `ErrorState`.
- Playground now includes explicit form interaction validation path (keyboard + async submit lifecycle) and sheet demo.
- Settings now includes practical account baseline fields, subscription status display, and safe dev utilities.

## [Onboarding Completion] - 2026-04-16

### Added
- `useCompleteOnboarding` mutation hook to update onboarding through `PATCH /api/v1/me` with a typed request payload.
- `UpdateMeRequest` type in `src/api/types.ts` for frontend-safe `PATCH /api/v1/me` request bodies.

### Improved
- Onboarding screen now performs real completion API call with loading and error states.
- Successful onboarding completion now invalidates/refetches `me` and relies on protected layout routing to transition users into tabs.
- Protected layout now redirects completed users away from onboarding to tabs when onboarding state becomes complete.

## [Public Auth Flow] - 2026-04-15

### Added
- Functional email/password sign-in flow via Clerk `useSignIn` + `setActive`.
- Functional email/password sign-up flow via Clerk `useSignUp` + `setActive`.
- Conditional email-code verification step during sign-up when Clerk returns unverified email requirements.
- Reusable auth components/hooks in `src/components/auth/` and `src/hooks/auth/`.

### Improved
- Public route files now stay thin route wrappers.
- Startup/auth hydration now shows a provider-level `ClerkLoading` boot spinner for smoother first load transitions.
- Shared Clerk error extraction helper added for consistent auth error messages.

## [Foundation Checkpoint] - 2026-04-15

### Hardening
- **Protected bootstrap guard**: fails closed when `/api/v1/me` cannot load, showing explicit retry and sign-out.
- **API client resilience**: stricter typing, safer JSON parsing, conditional `Content-Type` headers.
- **Environment clarity**: API base URL now supports `EXPO_PUBLIC_API_URL` with platform-safe local fallback.

## [Phase 1 Foundation] - 2026-04-15

### Initial Shell Scaffolding
- Routing grouped into `app/(public)` and `app/(protected)` using Expo Router.
- Clerk Expo initialized with SecureStore token cache.
- Typed API client and `useMe` bootstrap hook added.
- Bottom-tab shell and onboarding route group added.
