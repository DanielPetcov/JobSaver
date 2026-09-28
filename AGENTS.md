# AGENTS.md — Codex instructions

## Project

This repository is a personal job-application tracker. The user should be able to paste a public job-offer URL, have the backend fetch and clean the page, use an AI extraction service to produce structured job information, review the result, and save the application.

Read these files before making implementation decisions:

- `PRODUCT.md` — product goals, scope, users, constraints.
- `ARCHITECTURE.md` — application boundaries and backend/frontend responsibilities.
- `DATABASE.md` — entities, relationships, constraints, and future extensibility.
- `API.md` — current API contract.
- `AI_EXTRACTION.md` — extraction pipeline and anti-hallucination rules.
- `DESIGN.md` — visual direction and UI rules.
- `DEVELOPMENT.md` — local development, environment, Docker, and seed expectations.
- `IMPLEMENTATION_PLAN.md` — ordered MVP implementation plan.

## Non-negotiable constraints

1. Use one root Git repository.
2. Use one root `docker-compose.yml` to run PostgreSQL, NestJS API, and Next.js web app.
3. Use Next.js for the frontend.
4. Use NestJS for the backend.
5. Use TypeORM with PostgreSQL.
6. Do not implement authentication yet.
7. Still create a real `User` entity with a password hash field so authentication can be added later without redesigning the data model.
8. Provide an idempotent seed that creates exactly one personal development user from environment variables.
9. Scope application records by the seeded user's ID through a small current-user abstraction; do not hard-code user IDs in controllers.
10. Do not let the AI invent `dateApplied` or `sourceUrl`. `sourceUrl` comes from the request; `dateApplied` is set by the application at creation time unless explicitly edited later.
11. AI extraction must return structured data validated by a DTO/schema before it is used.
12. Treat extracted values as untrusted input. Sanitize and validate them.
13. Job-page fetching must include SSRF protections; do not allow requests to localhost, loopback, link-local, private-network, metadata-service, or otherwise non-public destinations.
14. The UI must be responsive and accessible, but do not build a generic dashboard made from a wall of cards.
15. Do not add authentication, multi-tenant infrastructure, queues, microservices, Redis, Kubernetes, analytics, notifications, browser extensions, or other product-scale infrastructure to this MVP unless explicitly requested.
16. Preserve a clean architecture so those capabilities can be added later.
17. Prefer boring, understandable code over clever abstractions.
18. Use current stable package versions compatible with the chosen Node/Next/Nest versions rather than blindly copying old examples.
19. Never commit secrets. Provide `.env.example`.
20. Run lint, typecheck, tests, and a production build when relevant before considering the task complete.

## Design workflow

The project intentionally uses Impeccable to avoid generic AI-generated UI. The official docs are referenced in `DESIGN.md` and `docs/IMPECCABLE.md`.

When working on UI:

- Read `PRODUCT.md` and `DESIGN.md` first.
- Use `$impeccable` where available in Codex.
- On a new UI surface, prefer the code-led workflow unless the user explicitly asks for a mockup-first approach.
- Use purposeful hierarchy, not decorative cards, badges, gradients, glows, oversized icons, or filler copy.
- Design for the task: this is an operations/workbench interface for one person, not a marketing website.
- Check narrow screens and keyboard interaction before finishing UI work.
- Keep visual decisions in `DESIGN.md` and page-specific decisions in `.impeccable/surfaces/`.
- After the initial UI exists, use `$impeccable critique` and `$impeccable audit` before polishing.

## Coding style

- TypeScript throughout application code.
- Use strict TypeScript settings.
- Keep modules cohesive: applications, users, extraction, job-page fetching.
- Use DTO validation at API boundaries.
- Keep controllers thin and move business logic into services.
- Prefer explicit names and small functions.
- Do not hide important business logic in decorators or magic helpers.
- Use environment variables for configuration.
- Add tests for extraction mapping, status changes, URL validation/SSRF protection, and the main application CRUD flow.

## Expected MVP workflow

1. User pastes a URL.
2. Backend validates the URL and fetches public page content.
3. Backend extracts readable text/metadata from the page.
4. AI returns validated structured fields: company, job title, description, company website if available, and 2–3 relevant skills.
5. Backend returns a preview without saving.
6. User reviews/edits the fields.
7. User confirms save.
8. Backend creates the application with `dateApplied = now` and `status = APPLIED` by default.
9. Dashboard shows saved applications and allows editing status/details.

When requirements are ambiguous, choose the smallest implementation consistent with this document and record the assumption in the relevant documentation instead of expanding scope.
