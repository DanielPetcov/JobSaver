# Development

## Prerequisites

- Node.js LTS compatible with the selected Next.js/NestJS versions
- Docker
- Docker Compose
- Git

A package manager such as npm/pnpm can be selected during implementation. Keep the choice consistent across the root, web app, and API.

## Environment

Copy:

```bash
cp .env.example .env
```

Required configuration should include at least:

- PostgreSQL connection settings
- API port
- web public API base URL
- AI provider configuration
- development user email
- development user password

Do not commit `.env`.

## One-command development runtime

The canonical startup should be:

```bash
docker compose up --build
```

The compose file should bring up:

- PostgreSQL
- NestJS API
- Next.js web

The API startup path should run database migrations and an idempotent dev seed before serving traffic, so a fresh clone can become usable with the single command above.

Keep this startup convenience clearly scoped to the development/personal Compose environment. A future production deployment can run migrations and seeds as separate controlled steps.

## Seed

Seed exactly one personal user from environment variables:

```text
SEED_USER_EMAIL
SEED_USER_PASSWORD
```

The seed must be idempotent: running it repeatedly should update nothing unnecessarily and must never create duplicate users.

Hash the seed password even though authentication is not implemented.

## Useful commands

The exact scripts can be chosen during implementation, but aim for:

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run db:migrate
npm run db:seed
```

## API development

- Keep API URLs behind an environment variable.
- Use `/api` as the API prefix.
- Provide `/api/health`.
- Validate incoming DTOs.

## Local development without Docker

It is useful, but not required, to make it possible to run web and API locally against a local PostgreSQL database. Docker Compose remains the canonical path.

## Error handling

The frontend should distinguish at least:

- invalid URL
- page fetch failed
- page content not extractable
- AI extraction failed
- validation failed
- save failed

Do not show internal exception stacks to the user.

## Testing priorities

### Backend

- URL validation and SSRF protection
- extraction provider mapping
- malformed AI output rejection
- create/list/update/delete application flows
- user ownership scoping
- idempotent seed

### Frontend

- paste/extract flow
- preview editing
- save flow
- status update
- empty state
- API error states
- mobile layout

## Dependency discipline

Do not add a library just because it is common in AI-generated starter projects. Every dependency should solve a concrete requirement.
