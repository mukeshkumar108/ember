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
