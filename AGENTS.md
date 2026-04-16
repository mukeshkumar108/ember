# AI Agent Guide (Operational)

This guide defines the foundational rules and constraints for AI agents (Gemini, Cursor, Claude, etc.) operating on the Ember Shell repository.

## Repo Purpose
Ember is a **non-product-specific mobile shell** for the [forgingfire](https://github.com/forgingfire) backend. Its sole purpose is to provide a pre-wired Expo foundation (Auth, API, Routing, Design System) for rapid experimentation.

## Architecture Rules
1. **Routing Strategy**: `app/` is strictly for Expo Router file-based routing and basic layouts. **Zero business logic** or complex state is allowed here.
2. **Logic Isolation**: `src/` is the home for all reusable logic.
   - `src/api/`: Typed fetch client and DTOs only.
   - `src/hooks/`: Data fetching (TanStack Query) and local state hooks.
   - `src/components/ui/`: Core, stateless UI primitives.
   - `src/components/auth/`: Reusable auth presentation components. Keep auth logic in `src/hooks/auth/`.
   - `src/styles/tokens.ts`: Single source of truth for all visual constants.
3. **API Discipline**:
   - Never use `fetch` directly. Always use the authenticated `request` from `src/api/client.ts` via the `useApi` hook.
   - All API responses must have a corresponding Zod schema or TypeScript interface (even if placeholder).
   - API base URL must come from `EXPO_PUBLIC_API_URL` (with local default fallback in `src/config/index.ts`).
4. **Auth Integrity**: Do not modify `app/(protected)/_layout.tsx` (the root guard) unless explicitly fixing a routing bug.

## Phase-1 Scope (Current)
- Public/Protected route grouping.
- Clerk Auth wiring with functional email/password sign-in and sign-up.
- Authenticated `GET /api/v1/me` bootstrap flow.
- Bottom-tab shell (Home, Explore, Settings).
- Onboarding status guard.
- Full premium UI component library (see UI System below).

## Out of Scope
- **Domain logic**: No features related to specific product ideas.
- **Analytics/Logging**: No third-party tracking services.
- **Mocking**: Do not implement mock servers; use real environment variables.

## Change Discipline
- **Surgical Edits**: Prefer `replace` over `write_file` for existing logic.
- **No Refactoring**: Do not refactor code outside the immediate task scope.
- **Verification**: Always verify that path aliases (`@/*`) are used for internal imports.
- **Quality Gate**: Run `pnpm lint` after each task-level change set and report warnings/errors honestly.

---

## UI System

### Design Tokens (`src/styles/tokens.ts`)
The **only** source of truth for colors, spacing, typography, radius, shadows, and animation constants. No ad-hoc values anywhere.

Key token groups:
- `tokens.colors` — background, backgroundSecondary, foreground, foregroundSecondary, muted, primary (#007AFF), success, warning, danger, border, overlay
- `tokens.spacing` — xs(4) sm(8) md(12) lg(16) xl(24) 2xl(32) 3xl(48) 4xl(64)
- `tokens.radius` — sm(8) md(12) lg(16) xl(20) full(9999)
- `tokens.typography.sizes` — xs(11) sm(13) base(16) lg(20) xl(24) 2xl(28) 3xl(34)
- `tokens.typography.weights` — regular medium semibold bold
- `tokens.typography.lineHeights` — tight(1.2) normal(1.5) relaxed(1.75) — multiply by font size
- `tokens.shadow.sm/md/lg` — spread directly onto style objects
- `tokens.animation.duration.fast/base/slow` + `tokens.animation.spring`

### Icon System
Use `lucide-react-native` for all icons. Do not use `expo-symbols` or `@expo/vector-icons` in new UI work.

```tsx
import { Settings } from 'lucide-react-native';
// Direct usage:
<Settings size={20} color={tokens.colors.muted} strokeWidth={1.75} />
// Via wrapper:
import { Icon } from '@/components/ui';
<Icon icon={Settings} size={20} color={tokens.colors.muted} />
```

Default `strokeWidth` is `1.75`. Increase to `2.25` for emphasis/active states.

### Component Catalogue (`src/components/ui/`)

**Layout & Screens**
| Component | Use for |
|---|---|
| `Screen` | Any screen — pass `scroll` for scrollable content, `keyboardAware` when TextInputs are present, `header` for a large page title |
| `FormScreen` | Input-heavy screens (auth, settings, profiles). Handles keyboard avoidance, scroll, safe area |
| `Section` | Groups related content with iOS-style small-caps header |
| `Card` | Grouped container. Variants: `default` (secondary fill), `elevated` (shadow), `outlined` (border) |
| `PressableCard` | Tappable card surface with press state |
| `Divider` | Horizontal/vertical separator. Optional `label` prop for "or" dividers |

**Forms & Inputs**
| Component | Use for |
|---|---|
| `Input` | Single-line text field. Focus ring (primary blue). Props: `label`, `error`, `hint` |
| `TextArea` | Multi-line input. Wraps `Input` with `multiline` |
| `Select` | Dropdown — native `ActionSheetIOS` on iOS, Sheet picker on Android |
| `Checkbox` | Boolean toggle with label/description. Reanimated bounce + haptics |
| `Toggle` | On/Off switch. Wraps RN `Switch` with haptics |

**Actions**
| Component | Props of note |
|---|---|
| `Button` | `variant`: primary, secondary, danger, ghost. `size`: sm, md, lg. Haptic on press |

**Display**
| Component | Use for |
|---|---|
| `Avatar` | Initials + hash color or image URI. Sizes: sm, md, lg, xl |
| `Badge` | Status pill. Variants: primary, success, warning, danger, neutral |
| `ListItem` | Settings rows, list rows. Props: `title`, `subtitle`, `leading`, `trailing`, `onPress`, `destructive` |
| `Icon` | Lucide icon wrapper |
| `Skeleton` | Loading shimmer. `shape`: rect, circle, text. `SkeletonListItem` composite |

**Overlays & Feedback**
| Component | Use for |
|---|---|
| `Sheet` | Bottom sheet. Reanimated spring + swipe handle. `closeOnBackdropPress` |
| `ConfirmModal` | Two-action dialog (Cancel + Confirm). Side-by-side buttons |
| `ToastProvider` / `useToast` | `showToast({ message, type: 'info'|'success'|'warning'|'error' })` |

**Feedback States** (`src/components/feedback/`)
| Component | Use for |
|---|---|
| `LoadingState` | Spinner + message. `fullScreen` prop |
| `ErrorState` | Error title + message + retry. `fullScreen` prop |
| `EmptyState` | Title + description + optional Lucide `icon` prop |

### Rules
- **No Ad Hoc Styles**: No new colors, spacing, or font sizes outside `tokens.ts`.
- **Form Pattern**: Use `FormScreen` for any screen with text inputs.
- **Feedback Pattern**: Use shared `LoadingState` and `ErrorState` for async states.
- **Overlay Pattern**: Use `Sheet`, `ConfirmModal`, `Toast` before creating new overlay patterns.
- **List Pattern**: Use `ListItem` + `Card variant="outlined"` for settings-style lists.
- **Extend, Don't Duplicate**: Extend existing primitives over creating near-duplicate components.
- **Playground Discipline**: Keep UI playground usage internal (`app/(protected)/(tabs)/playground.tsx`). All controls must be interactive or explicitly labeled visual-only.

---

## Handover Reporting Format
When completing a task, you **must** report:
1. **Files Added/Removed/Renamed**.
2. **Key Logic Changes**: 1-2 sentences on the technical shift.
3. **Assumptions Made**: List any DTO or backend assumptions.
4. **Unresolved Risks**: List any deferred tasks or potential breaking points.
5. **Next Step**: The single most logical task for the next agent.
6. **Verification Run**: Commands executed (`pnpm lint`, smoke checks) and outcomes.
