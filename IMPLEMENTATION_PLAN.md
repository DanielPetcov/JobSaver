# MVP Implementation Plan

Work in the following order. Finish each phase coherently before moving to the next.

## Phase 1 — Repository and infrastructure

- Initialize one root Git repository.
- Create `apps/web` and `apps/api`.
- Add root Docker Compose.
- Add PostgreSQL service with persistent volume.
- Add `.env.example` and `.gitignore`.
- Establish TypeScript, formatting, linting, and test conventions.

## Phase 2 — Backend foundation

- Bootstrap NestJS.
- Configure TypeORM/PostgreSQL.
- Create `User` entity.
- Create `JobApplication`, `Skill`, and join entity.
- Create status enum.
- Create migrations.
- Implement health endpoint.
- Implement idempotent user seed.
- Implement current-user abstraction.

## Phase 3 — Application CRUD

- Create DTOs and validation.
- Create application service/repository flow.
- Implement create, list, get, update, delete.
- Enforce current-user ownership.
- Add pagination and basic status/search filters.

## Phase 4 — Job-page ingestion

- Implement safe URL validation.
- Implement SSRF-safe public URL fetching.
- Implement bounded HTML fetching.
- Extract metadata and readable page text.
- Add explicit errors for unsupported/unreadable pages.

## Phase 5 — AI extraction

- Define provider interface.
- Implement first provider adapter.
- Add structured extraction schema.
- Add prompt-injection defenses.
- Validate model output.
- Return preview only; do not persist in extraction endpoint.

## Phase 6 — Frontend

- Bootstrap Next.js App Router.
- Build the application workbench.
- Build URL capture flow.
- Build editable extraction preview.
- Build list/table of saved applications.
- Add status editing.
- Add responsive/mobile states.

## Phase 7 — Integration and polish

- Connect web to API.
- Verify one-command Docker Compose startup.
- Run migrations and seed automatically in development.
- Add useful loading/error/empty states.
- Run accessibility checks.
- Run Impeccable critique/audit and fix findings that fit the product.
- Run lint, typecheck, tests, and production builds.

## Phase 8 — Documentation

- Update `README.md` with final run commands.
- Update `DESIGN.md` after the first UI is implemented and reviewed.
- Add/update page surface briefs under `.impeccable/surfaces/` when routes stabilize.

## Definition of done

The user can run one command, open the web app, paste a public job URL, receive a structured editable extraction, save it as an application, and later view/edit its status and details.
