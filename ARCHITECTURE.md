# Architecture

## High-level structure

Use a monorepo with two application directories and one root compose file:

```text
jobtrack/
├── apps/
│   ├── web/                 # Next.js App Router
│   └── api/                 # NestJS + TypeORM
├── docs/
│   └── IMPECCABLE.md
├── .impeccable/
│   └── surfaces/
├── AGENTS.md
├── PRODUCT.md
├── DESIGN.md
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
├── AI_EXTRACTION.md
├── DEVELOPMENT.md
├── IMPLEMENTATION_PLAN.md
├── docker-compose.yml
├── .env.example
└── .gitignore
```

The exact package-manager workspace layout can be chosen by Codex, but keep the root repository simple and make local commands obvious.

## Runtime components

### Web

Next.js application responsible for:

- job URL input
- extraction preview/edit form
- application list/table
- application detail/editing
- status updates
- responsive and accessible UI

The web app should call the NestJS API; do not connect directly to PostgreSQL.

### API

NestJS modular monolith responsible for:

- application CRUD
- current-user context for the seeded user
- public URL validation
- job page fetching and content cleaning
- AI extraction orchestration
- DTO validation
- status changes
- database persistence

Suggested modules:

```text
src/
├── app.module.ts
├── config/
├── database/
├── users/
├── applications/
├── job-pages/
└── extraction/
```

Do not create a separate service/process for each module.

### PostgreSQL

Single PostgreSQL container for the MVP.

## Extraction flow

```text
Browser
  |
  | POST /applications/extract-preview { url }
  v
NestJS
  |
  +--> URL validation / SSRF protection
  |
  +--> JobPageFetcher
  |       |
  |       +--> fetch public HTML
  |       +--> strip irrelevant content
  |       +--> produce bounded readable text + metadata
  |
  +--> AIExtractionService
  |       |
  |       +--> provider adapter
  |       +--> structured output validation
  |
  +--> return preview
  |
  | POST /applications
  v
Database
```

## AI provider boundary

Create an interface such as:

```ts
interface JobExtractionProvider {
  extract(input: JobExtractionInput): Promise<JobExtractionResult>;
}
```

The API service should depend on the interface, not directly on an SDK-specific implementation. The first implementation can target one provider configured by environment variables.

## Current-user boundary

Create a small `CurrentUserService` or equivalent abstraction that resolves a configured development user ID.

Controllers/services should ask the abstraction for the current user rather than using a hard-coded UUID. Later, authentication can replace that implementation without changing application business logic.

## Future extension points

The design leaves room for:

- authentication/session guard
- multiple users
- application status history
- notes and interview events
- attachments
- reminders
- AI provider switching
- asynchronous extraction jobs
- browser extension intake
- import/export

These are extension points, not MVP tasks.

## Operational posture

For now, this is a development/personal deployment. Docker Compose should be the canonical local runtime and should make the whole stack available with one command.

A productionized deployment can later separate database migrations/seeding from the API boot process and add HTTPS, secrets management, backups, observability, and authentication.
