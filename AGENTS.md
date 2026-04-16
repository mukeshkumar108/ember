# AI Agent Guide (Operational)

This guide defines the foundational rules and constraints for AI agents (Gemini, Cursor, Claude, etc.) operating on the Ember Shell repository.

## Repo Purpose
Ember is a **non-product-specific mobile shell** for the [forgingfire](https://github.com/forgingfire) backend. Its sole purpose is to provide a pre-wired Expo foundation (Auth, API, Routing) for rapid experimentation.

## Architecture Rules
1. **Routing Strategy**: `app/` is strictly for Expo Router file-based routing and basic layouts. **Zero business logic** or complex state is allowed here.
2. **Logic Isolation**: `src/` is the home for all reusable logic.
    - `src/api/`: Typed fetch client and DTOs only.
    - `src/hooks/`: Data fetching (TanStack Query) and local state hooks.
    - `src/components/ui/`: Core, stateless UI primitives.
    - `src/components/auth/`: Reusable auth presentation components. Keep auth logic in `src/hooks/auth/`.
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

## Out of Scope
- **Domain logic**: No features related to specific product ideas.
- **Analytics/Logging**: No third-party tracking services.
- **Complex UI**: No custom design systems or heavy animations.
- **Mocking**: Do not implement mock servers; use real environment variables.

## Change Discipline
- **Surgical Edits**: Prefer `replace` over `write_file` for existing logic.
- **No Refactoring**: Do not refactor code outside the immediate task scope.
- **Verification**: Always verify that path aliases (`@/*`) are used for internal imports.
- **Quality Gate**: Run `pnpm lint` after each task-level change set and report warnings/errors honestly.
- **UI Tokens**: All UI must use tokens from `src/styles/tokens.ts`.
- **No Ad Hoc Styles**: Do not introduce new colors or spacing values ad hoc.
- **Use Base Primitives**: Use `Button`, `Input`, `Card`, `Screen`, and `Section` before creating new UI components.
- **Extend, Don't Duplicate**: Prefer extending existing primitives over creating near-duplicate components.
- **Playground Discipline**: Keep UI playground usage internal and non-product (`app/(protected)/(tabs)/playground.tsx`) and avoid adding product logic there.

## Handover Reporting Format
When completing a task, you **must** report:
1. **Files Added/Removed/Renamed**.
2. **Key Logic Changes**: 1-2 sentences on the technical shift.
3. **Assumptions Made**: List any DTO or backend assumptions.
4. **Unresolved Risks**: List any deferred tasks or potential breaking points.
5. **Next Step**: The single most logical task for the next agent.
6. **Verification Run**: Commands executed (`pnpm lint`, smoke checks) and outcomes.
