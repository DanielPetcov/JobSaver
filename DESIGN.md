---
# Seed Design Direction
platform: web
---

# Design Direction — JobTrack

This is a **personal workbench for tracking job applications**, not a SaaS marketing site and not an analytics dashboard.

The UI should feel like a focused professional tool: calm, tactile, legible, slightly opinionated, and efficient.

## Core design idea

Use a **job ledger / workbench** metaphor rather than a card-heavy dashboard. The main screen should feel like a workspace where a list of applications is the primary object and the extraction flow is the primary action.

## Visual character

- Warm off-white or very light neutral page background.
- Near-black/dark ink for primary text.
- One distinct accent color used sparingly for focus, primary actions, links, and selected states.
- Minimal shadows; rely more on borders, spacing, and tonal grouping.
- Mostly small-to-medium corner radii; avoid excessive pill shapes.
- No glossy glass panels.
- No neon glows.
- No decorative gradient blobs.
- No giant hero headline.
- No icon-in-rounded-square-above-every-heading pattern.
- No stack of nested cards containing more cards.
- No fake metrics simply to fill a dashboard.

## Typography

Use a highly readable sans-serif as the primary typeface. A restrained monospace face may be used for small metadata such as URLs, dates, IDs, or technical labels, but not for the whole interface.

Create a clear type hierarchy with distinct heading/body/meta levels. Avoid making every heading oversized.

## Layout

The most important screen is the application workbench:

- clear top-level page heading
- prominent paste-URL capture control
- application list as the main content area
- compact filters/search above the list when needed
- extraction preview presented as a focused editing surface, not a generic modal full of widgets

On mobile, prioritize the URL capture flow and the application list. Avoid horizontal overflow.

## Components

Buttons:

- solid primary button for the main action
- quiet/outline buttons for secondary actions
- text links only where navigation is appropriate
- clear hover/focus/disabled states

Status:

Use restrained color differences and text labels. Status should be understandable without color alone.

Application row/card:

- company and role are visually dominant
- status and date are easy to scan
- skills are supporting metadata
- source URL can be opened without cluttering the row

Forms:

- visible labels
- concise help text only where useful
- errors near the relevant field
- keyboard-first interaction

## Accessibility

- WCAG-conscious contrast.
- Visible keyboard focus.
- Semantic HTML.
- Labels for every form control.
- Do not rely on color alone for status.
- Reasonable touch target sizes.
- Clear loading and extraction error states.
- Respect reduced-motion preferences.

## Motion

Use motion only to explain state changes or preserve orientation, such as loading/extraction progress, opening an editor, or confirming a save. No decorative floating/bouncing UI.

## Content tone

Plain, direct, useful. Avoid startup/marketing language such as "supercharge", "unlock", "seamless", or "revolutionize".

## Impeccable guidance

The project should use Impeccable context files and workflows. The official documentation says `PRODUCT.md` is for audience, goals, platform, constraints, and terminology; `DESIGN.md` is for the shared visual system; page-specific briefs belong under `.impeccable/surfaces/`. citehttps://impeccable.style/docs/context

For Codex, Impeccable is invoked as `$impeccable`. Its documentation also recommends reviewing the actual task and choosing a visual direction before implementation rather than defaulting to familiar templates. citehttps://impeccable.style/docs/

Use `$impeccable critique`, `$impeccable audit`, and focused refinement commands during the UI work. Impeccable's automatic checks can catch patterns such as excessive cards, decorative icon tiles, weak hierarchy, and other common AI-generated UI habits. citehttps://impeccable.style/slop/https://impeccable.style/docs/hooks/

This file is a **seed direction**, not a license to invent a visual system detached from the product. The final tokens/components should be documented again after the first implementation.

## Implemented workbench tokens (MVP)

- Background `#f7f5ef`, editing surface `#fffdf8`, ink `#202422`, muted copy `#676c68`, and restrained green action/focus system (`#1a5c4c` / `#e99d36`).
- The capture strip and ledger use borders and spacing for grouping; the review surface alone has a thin accent top edge to establish the temporary editing context.
- Desktop uses a semantic table. At narrow widths it becomes labelled, stacked ledger entries without horizontal page overflow.
- Controls use 4px radii, visible 3px keyboard focus outlines, and status text/selects rather than color-only encoding.
