# Product Context

## Product

Working name: **JobTrack**

A private, single-user job application tracker for keeping a structured record of jobs I apply to.

## Users

The MVP is for one person using it locally or on a private personal deployment.

There is no authentication in the MVP. A `User` table still exists because the data model should be ready for authentication and multiple users later.

## Product purpose

Reduce the friction of recording a job application. The primary input is a job-offer URL. The system should do the boring data collection, then let the user verify and save it.

## Primary task

Paste a job-offer link and quickly turn it into a reviewable job application record.

## Information tracked

Each job application should support at least:

- company name
- job title
- source/job-offer URL
- company website URL when available
- short description
- date applied
- status
- 2–3 relevant skills

The product may keep an internal ID, timestamps, and user relation as implementation fields.

## MVP workflow

`Paste URL → Extract → Review/Edit → Save → Track status`

Extraction is a preview step. The AI must not silently create a database record.

## Default behavior

- `dateApplied`: server-generated current timestamp when the application is first saved.
- `status`: `APPLIED` by default.
- `sourceUrl`: exact URL submitted by the user, after safe URL normalization.
- AI-derived fields can be edited before saving.
- Skills should normally contain 2–3 concise technologies or capabilities that are genuinely relevant to the role.

## Product principles

### Fast capture

The home screen should make the paste-and-extract action obvious without making the entire page look like a marketing hero.

### Human verification

AI extraction is assistance, not truth. The user reviews the proposed data before saving.

### Low maintenance

This is a personal tool. Prefer a simple modular monolith over infrastructure intended for a large SaaS product.

### Future-ready data model

Use a proper relational model and stable IDs now so that authentication, multiple users, application notes, interviews, reminders, and history can be added later without replacing the core schema.

### Accessibility

Keyboard use, readable contrast, semantic controls, focus states, error clarity, and mobile usability are product requirements.

## MVP non-goals

Do not implement now:

- sign-up/login/session management
- browser extension
- email inbox integration
- calendar integration
- automated follow-up reminders
- resumes/cover-letter generation
- job scraping at scale
- multi-provider AI routing
- background job queues
- team collaboration
- billing
- analytics dashboards beyond simple application tracking

## Terminology

- **Application**: one record representing a job the user applied to.
- **Source URL**: the job-offer page the user supplied.
- **Extraction preview**: AI-derived data shown before saving.
- **Status**: the user's current stage for the application.
