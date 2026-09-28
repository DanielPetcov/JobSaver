# Database Design

Use PostgreSQL with TypeORM.

## 1. users

```text
users
-----
id                uuid PK
email             varchar UNIQUE NOT NULL
password_hash     varchar NULL
created_at        timestamptz NOT NULL
updated_at        timestamptz NOT NULL
```

Notes:

- The user explicitly wants a password field now, but authentication is not part of the MVP.
- Store a password hash, not a plaintext password.
- `password_hash` is nullable so a future migration can define an auth policy without forcing fake credentials.

## 2. job_applications

```text
job_applications
----------------
id                       uuid PK
user_id                  uuid FK -> users.id
company_name             varchar NOT NULL
job_title                varchar NOT NULL
source_url               text NOT NULL
company_website_url      text NULL
short_description        text NULL
date_applied             timestamptz NOT NULL
status                   application_status NOT NULL DEFAULT 'APPLIED'
created_at               timestamptz NOT NULL
updated_at               timestamptz NOT NULL
```

Recommended indexes:

- `(user_id, date_applied DESC)` for the main list
- `(user_id, status)` for status filtering
- optionally a normalized source URL unique constraint later, but do not block the user from saving the same job twice in the MVP without explicit product decision

## 3. skills

```text
skills
------
id                uuid PK
name              varchar NOT NULL
slug              varchar UNIQUE NOT NULL
created_at        timestamptz NOT NULL
```

## 4. job_application_skills

```text
job_application_skills
----------------------
job_application_id       uuid FK -> job_applications.id
skill_id                 uuid FK -> skills.id
PRIMARY KEY (job_application_id, skill_id)
```

This many-to-many relation is intentional. Even though the UI initially shows only 2–3 skills, a normalized skills table makes future filtering, analytics, deduplication, and skill taxonomy possible.

## Status enum

Use a database enum or TypeScript-backed enum with these initial values:

- `APPLIED`
- `SCREENING`
- `INTERVIEW`
- `OFFER`
- `REJECTED`
- `WITHDRAWN`
- `ARCHIVED`

Keep the set small. Adding a status should be a deliberate schema/product change.

## Why not store skills as JSON/text?

A simple array would be faster to implement, but normalized skills are a better fit for the stated future extensibility requirement. It avoids embedding a future migration problem into every application row.

## Timestamps

Prefer `timestamptz` and UTC at the persistence layer. Convert to the user's local presentation format in the frontend.

## Deletion policy

For MVP, application deletion can be a real delete. Future audit/history requirements can introduce soft deletion or status history later.

## Future schema additions

Potential future tables, not part of the MVP:

- `application_status_history`
- `application_notes`
- `interviews`
- `reminders`
- `attachments`
- `ai_extractions`

Do not create empty tables for these now unless the implementation genuinely needs them.
