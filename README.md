# Ember Shell (Expo Foundation)

Ember is a reusable mobile frontend shell for the [forgingfire](https://github.com/forgingfire) backend. It is intentionally product-agnostic and focuses on auth, routing, bootstrap, and reusable app structure.

## Maturity
**Status**: Foundation checkpoint (Phase 1)  
**Focus**: Reliable shell behavior over feature breadth

Implemented now:
- Public/protected route grouping via Expo Router.
- Clerk + SecureStore auth wiring.
- Functional email/password sign-in and sign-up screens.
- Typed API client (`src/api/client.ts`) and `useMe` bootstrap hook.
- Protected route guard with onboarding gate.
- Bottom tab shell scaffold (Home, Explore, Settings).

Still intentionally deferred:
- Real onboarding completion flow/API wiring.
- Device registration API integration.

## Architecture Boundaries
- `app/`: routing and layouts only.
- `src/api/`: typed API client + DTOs.
- `src/hooks/`: data/bootstrap hooks.
- `src/components/ui/`: reusable stateless primitives.
- `src/components/auth/`: reusable auth screen components (state handled by `src/hooks/auth/`).

## Setup
1. Create `.env` from `.env.example`.
2. Set required variables:
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://localhost:4000
```
3. Install and run:
```bash
pnpm install
pnpm ios      # or pnpm android / pnpm web
```

For Android emulator local backend access, set `EXPO_PUBLIC_API_URL=http://10.0.2.2:4000`.

## Auth Behavior Notes
- Sign-in uses Clerk email/password (`useSignIn` + `setActive`).
- Sign-up uses Clerk email/password (`useSignUp` + `setActive`).
- Email verification is **conditional**, not hardcoded: Ember only prompts for email code when Clerk reports unverified email fields in the sign-up attempt.

## Operational Docs
- [AGENTS.md](./AGENTS.md): architecture and agent handover rules.
- [CURRENT_STATE.md](./CURRENT_STATE.md): honest current status and risks.
- [CHANGELOG.md](./CHANGELOG.md): incremental checkpoint history.
