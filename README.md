# Ember Shell (Expo Foundation)

Ember is a mobile frontend foundation for the [forgingfire](https://github.com/forgingfire) backend ecosystem.

## Maturity Statement
**Status**: Foundation-Only (v0.1.0-alpha)  
**Verification**: Unverified (Plumbing complete, backend communication untested)

Ember is a **non-product shell** for rapid mobile experimentation. It is not an application but a pre-configured architecture of routing, authentication, and authenticated API patterns.

## Current Maturity (Phase-1 Scaffolding)
- [x] **File-based Routing**: Expo Router grouping for Public and Protected routes.
- [x] **Clerk Auth**: Initialized with `expo-secure-store`. **(Forms are placeholders)**.
- [x] **API Client**: Typed fetch client that auto-attaches Clerk tokens.
- [x] **Data Persistence**: TanStack Query and state-driven route guards.
- [x] **Onboarding Shell**: Guarded redirection logic for new users.

## Directory Structure
- `app/`: Routing and layouts **only**.
- `src/api/`: Typed API client and DTOs.
- `src/auth/`: Clerk initialization and helpers.
- `src/components/ui/`: Stateless, themed UI primitives.
- `src/hooks/`: Data fetching and business logic hooks.
- `src/styles/`: Centralized theme and global styling.

## Getting Started

1.  **Prepare Environment**:
    Create a `.env` file from `.env.example` and add your Clerk key:
    ```bash
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    ```

2.  **Install & Start**:
    ```bash
    pnpm install
    pnpm ios   # or android
    ```

## Operational Docs (For Agents & Humans)
- [AGENTS.md](./AGENTS.md): Architectural constraints and handover format.
- [CURRENT_STATE.md](./CURRENT_STATE.md): Honest assessment of what is broken or unverified.
- [CHANGELOG.md](./CHANGELOG.md): History of implementation and unverified assumptions.
