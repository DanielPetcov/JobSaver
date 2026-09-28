# First Prompt for Codex

Paste this into Codex from the repository root after placing this context pack in the repo.

---

We are building a small personal job-application tracker called **JobTrack**.

Before writing application code, read these files completely:

- `AGENTS.md`
- `PRODUCT.md`
- `ARCHITECTURE.md`
- `DATABASE.md`
- `API.md`
- `AI_EXTRACTION.md`
- `DESIGN.md`
- `DEVELOPMENT.md`
- `IMPLEMENTATION_PLAN.md`
- `docs/IMPECCABLE.md`
- `.impeccable/surfaces/application-workbench.md`

Also use the official Impeccable documentation referenced there. In Codex, use `$impeccable` for UI work. The design must intentionally avoid generic AI-generated dashboard patterns.

## Goal

Build the MVP end-to-end, not just a scaffold.

The final local workflow must be:

```text
docker compose up --build
```

Then I should be able to open the Next.js app, paste a public job-offer URL, extract information with AI, review/edit the extraction, save it, and manage the application's status/details.

## Required stack

- Frontend: Next.js + TypeScript
- Backend: NestJS + TypeScript
- ORM: TypeORM
- Database: PostgreSQL
- Runtime: Docker Compose
- One root Git repository
- No authentication yet

## Data model

Implement the database described in `DATABASE.md`:

- `users`
- `job_applications`
- `skills`
- `job_application_skills`

Use UUID primary keys and UTC `timestamptz` fields.

Create a real `password_hash` field on `users`, but do not build auth/session/login yet.

Create an idempotent seed that inserts exactly one development user using:

```text
SEED_USER_EMAIL
SEED_USER_PASSWORD
```

Hash the password. Do not store it in plaintext.

Create a current-user abstraction based on `DEV_USER_ID`/seeded user context so application ownership is real in the schema even though auth is absent.

## Important business rules

When I submit a job URL:

1. The backend must validate it.
2. Protect the fetcher against SSRF and internal/private network targets.
3. Fetch the public page with conservative timeout/size/redirect limits.
4. Extract readable text and useful metadata.
5. Pass cleaned content to an AI extraction provider.
6. Validate the structured AI output before returning it.
7. Do not save automatically.
8. Return an editable preview to the frontend.
9. When the user confirms, save the application.
10. `sourceUrl` comes from the user's request, not AI.
11. `dateApplied` is set by the server at save time.
12. `status` defaults to `APPLIED`.
13. Skills should normally be 2–3 concise relevant technologies/capabilities.
14. Missing or uncertain AI fields should be `null`, not invented.

## AI design

Create a provider interface such as:

```ts
interface JobExtractionProvider {
  extract(input: JobExtractionInput): Promise<JobExtractionResult>;
}
```

Implement one provider first, configured through environment variables. Keep the rest of the application provider-agnostic.

AI output should be equivalent to:

```ts
{
  companyName: string | null;
  jobTitle: string | null;
  companyWebsiteUrl: string | null;
  shortDescription: string | null;
  skills: string[];
}
```

Validate this output with a schema/DTO. Treat webpage text as untrusted content and explicitly defend against prompt injection inside job pages.

## API

Implement the contract in `API.md`, including:

- `GET /api/health`
- `POST /api/applications/extract-preview`
- `POST /api/applications`
- `GET /api/applications`
- `GET /api/applications/:id`
- `PATCH /api/applications/:id`
- `DELETE /api/applications/:id`

Use `/api` as the prefix.

## Frontend

Build the actual workbench UI, not a placeholder.

Primary user journey:

```text
Paste job URL → Extract → Review/Edit → Save
```

The saved applications list is the main content area.

The design should feel like a focused personal workbench/job ledger. It should not look like a generic AI-generated SaaS admin dashboard.

Follow `DESIGN.md` and the Impeccable guidance closely:

- no wall of cards
- no decorative gradients/glows
- no oversized hero typography
- no giant icon tiles
- no repetitive pills
- no fake metrics just to fill space
- strong type hierarchy
- purposeful spacing and borders
- restrained radius/shadows
- semantic HTML
- keyboard-accessible controls
- visible focus states
- mobile-first responsive behavior
- status must not be communicated by color alone

Do not use a marketing landing-page layout for the core app.

## Implementation approach

Work in phases from `IMPLEMENTATION_PLAN.md`.

Start by producing the repository structure, app scaffolding, database connection, migrations, seed, and Dockerfiles. Then implement the backend CRUD and extraction pipeline, then the frontend, then integration/tests/polish.

Keep the architecture as a modular monolith. Do not introduce queues, Redis, microservices, Kubernetes, authentication, analytics, or other infrastructure that is not required for the MVP.

Prefer understandable code over abstractions for their own sake.

## Verification

Before considering the MVP done:

- `docker compose up --build` works from a clean checkout
- database migrations run
- seed is idempotent
- `/api/health` works
- extraction preview works with a suitable public page
- malformed AI output is rejected
- users cannot access another user's application records through an arbitrary ID
- CRUD works
- frontend works on narrow screens
- keyboard navigation and visible focus work
- lint passes
- typecheck passes
- tests pass
- production builds pass
- run `$impeccable critique` and `$impeccable audit` on the UI and fix applicable findings

## Working style

Do not stop at a plan or tell me to create files manually. Create the files, implement the code, and keep the docs synchronized with the implementation.

When an implementation choice is not specified, choose the smallest reasonable option that preserves the architecture and constraints in the context files.

After the first complete pass, summarize:

1. what was built,
2. the final repository structure,
3. how to run it,
4. any assumptions or known limitations,
5. what future extension point would be easiest to add next.
