# Changelog

All notable changes to this project are documented here.

## [Data-Boundary + Docs Hardening] - 2026-04-17

### Added
- `src/api/schemas.ts` with Zod schemas for active `/api/v1/me` response contracts.
- `src/api/validation.ts` with `parseApiContract` and explicit `ApiContractError`.
- `src/components/feedback/app-error-boundary.tsx` lightweight app-level render crash fallback.
- `DEVELOPMENT.md` docs-first extension guide for common Ember tasks.

### Changed
- `useMe`, `useUpdateMe`, and `useCompleteOnboarding` now request `unknown` and parse with Zod before UI state consumes API payloads.
- `app/_layout.tsx` now wraps app content with `AppErrorBoundary`.
- `README.md`, `AGENTS.md`, and `CURRENT_STATE.md` were rewritten to match current architecture and hardening patterns.

### Notes
- Focused on contract safety and contributor clarity, not new product features.

## [Form Foundation] - 2026-04-17

### Added
- **`react-hook-form`** + **`@hookform/resolvers`** — installed as core dependencies
- **`src/lib/schemas.ts`** — shared zod schemas: `signInSchema`, `signUpSchema`, `verificationCodeSchema`, `profileSchema` with TypeScript inferred types
- **`FORM_PATTERNS.md`** — complete form reference: standard pattern, controller bindings for every primitive, multi-step forms, edit forms with `reset()`, zod guidelines, what not to do, practical "adding a new form" walkthrough

### Changed
- **`src/hooks/auth/use-email-sign-in.ts`** — stripped manual form state; now accepts `SignInFormData`, throws on error, returns `{ submit, isSubmitting, isLoaded }`
- **`src/hooks/auth/use-email-sign-up.ts`** — stripped manual form state; now accepts typed data per step, throws on error, retains `isPendingVerification` flow state
- **`src/components/auth/sign-in-screen.tsx`** — refactored to `useForm` + `Controller`; field-level zod errors; server error on `errors.root`
- **`src/components/auth/sign-up-screen.tsx`** — refactored to two `useForm` instances (credentials step + verification step); field-level errors on both forms
- **`src/components/account/settings-screen.tsx`** — profile section uses `useForm` + `Controller`; `reset(toFormDefaults(user))` on load/save; `isDirty` gates Save button; `toFormState`/manual state removed
- **`app/(protected)/(tabs)/playground-form.tsx`** — replaced manual state demo with live validated form: `Input`, `TextArea`, `Select`, `Checkbox`, field errors, server error simulation, success path
- **`AGENTS.md`** — added Form System section with hard rules, controller binding table, schema guidance

## [Accessibility & Apple Compliance Pass] - 2026-04-16

### Accessibility
- **`Button`** — `accessibilityRole`, `accessibilityLabel` (includes "loading"), `accessibilityState.busy/disabled`
- **`Input`** — `accessibilityLabel` from label prop, `accessibilityInvalid`, `accessibilityValue` for errors, error `Text` has `role="alert"`
- **`Select`** — `accessibilityRole="combobox"`, combined label+value accessible label, `expanded`/`disabled` state
- **`Checkbox`** — combined label+description `accessibilityLabel`, `checked`/`disabled` state, 44pt minimum row height
- **`ListItem`** — combined title+subtitle `accessibilityLabel`, `disabled` state on pressable variant
- **`Sheet`** — `accessibilityViewIsModal` traps VoiceOver focus inside overlay
- **`ConfirmModal`** — `accessibilityViewIsModal`, dialog panel has `accessibilityRole="alert"` for immediate announcement
- **`Toast`** — `accessibilityLiveRegion="polite"` + `role="status"` so messages announce without focus

### Reduce Motion
- `useReduceMotion()` hook added (`src/hooks/use-reduce-motion.ts`) — subscribes to system "Reduce Motion" setting
- Wired into: `Sheet`, `ConfirmModal`, `Toast`, `Checkbox` — all spring/bounce animations replaced with instant (`duration: 0`) when enabled
- Hook exported from `src/hooks/index.ts`

### Color Contrast (WCAG AA)
- **`Badge`** success/warning text: changed from `tokens.colors.success/warning` to `#1A7A32` / `#7A4A00` (pass 4.5:1 on tinted backgrounds)
- **`Toast`** success background: `#1A7A32` (was `#34C759` which failed with white text)
- **`Toast`** warning background: `#7A4A00` (was `#FF9500` which failed with white text)

### Documentation
- **`APPLE_COMPLIANCE.md`** added — covers what's built in, per-project config (bundle ID, usage strings, privacy manifest, Sign in with Apple rule, EAS submit, ATT), VoiceOver testing checklist, reduce motion test procedure, common rejection reasons

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
