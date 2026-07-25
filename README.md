# TaxFlow AI

A same-day, clickable frontend prototype for an AI-assisted tax preparation workflow. Built for the AI Engineer case study.

The goal is to communicate, through interaction, how a CPA and client can work with AI-extracted return data while keeping trust, traceability, and control.

## Demo flow (Definition of Done)

1. Open the CPA Dashboard — see what needs attention first, ranked by deadline + issues + status.
2. Open **John Smith — 2025 Individual Return**.
3. See return progress, blockers, owner, next action.
4. Open **Interest Income** — see AI confidence, evidence, calculation, and recommended action.
5. Open **View Evidence** — side-by-side view of the return field and the source 1099-INT with a highlighted OCR region.
6. Open **Mortgage Interest** — a low-confidence AI extraction ($14,320 at 61%). Correct it to **$14,230**.
7. Watch the field flip to **Corrected by Sarah Chen** and the John Smith open-issue count drop from 3 → 2 in the drawer, the return, and the dashboard.
8. Open **Dividend Income** — see the AI flag a possibly missing 1099-DIV, with a contextual thread attached (client-visible + internal note).
9. Optional: switch role to **Personal Taxpayer** via the top-right menu to see the client view.

## What is real vs simulated

**Real (implemented in the frontend):**

- Route navigation (`react-router-dom`, HashRouter for portable hosting)
- Priority ranking (`src/lib/priority.ts`) driven by deadline + open issues + status
- Field state machine: `ai / needs_review / verified / editable / locked / missing`
- AI Review drawer: confidence, "what/why", evidence list, calculation, recommendation
- Side-by-side evidence viewer with a positioned highlight overlay
- Correction workflow that mutates shared React state, propagates to dashboard counts, preserves the previous AI value
- Role switch (CPA ⇄ Personal Taxpayer) that re-routes the sidebar and pages
- Contextual message thread attached to an issue, with Client-visible / Internal note visibility toggle
- Breadcrumbs and "back to review queue" navigation

**Simulated (hardcoded / mocked for the case study):**

- OCR — mock SVG documents with pre-defined highlight rectangles
- Document parsing / RAG / vector search
- LLM inference and confidence scoring — all AI outputs live in `src/data/aiResults.ts`
- Authentication, permissions, RBAC
- Messaging backend — messages live in React state and reset on refresh
- Tax calculations, e-file submission
- Client onboarding, file upload processing, notifications

State is in-memory. Refresh the browser to reset the prototype to its factory data.

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Lucide React icons
- `react-router-dom` (HashRouter, so it hosts cleanly behind any reverse proxy)

No backend. No database. No API calls.

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

For hosted preview through a reverse proxy (e.g. code-server / OnDemand):

```bash
npm run build
npm run preview
```

`vite preview` serves the production build, which uses relative asset paths (`base: './'`) and works behind any proxy path.

## Project structure

```
src/
├── components/     UI building blocks (AppShell, Sidebar, badges, drawer, dialogs, thread)
├── pages/          Dashboard, ReturnDetail, EvidenceReview, ClientHome, Documents, Placeholder
├── data/           Typed mock data: returns, fields, aiResults, evidence, stages, messages
├── state/          AppState provider (returns/fields/messages + mutations)
├── lib/            priority scoring + shared helpers
└── types/          Shared TS types
public/
└── mock-documents/ Rendered SVG "scans" for the source-evidence viewer
```

## Design decisions

- **HashRouter over BrowserRouter.** Removes the need for server-side rewrites — the prototype hosts anywhere, including static-file hosts and reverse-proxied dev environments.
- **Never rely on color alone.** Every field state has an icon + label + badge in addition to color, so state is legible for colorblind users and screenshots.
- **Priority is calculated, not hardcoded.** `getPriorityScore` in `src/lib/priority.ts` blends deadline, open issue count, and status, so the queue changes as state updates.
- **Corrections preserve the AI value.** After a CPA correction the field stores `{ previousValue, by, at, reason }` so the audit trail survives the fix.
- **Every visible control does something or is removed.** Placeholders for unbuilt pages exist to keep the shell honest — they explicitly say the demo lives on the Dashboard and John Smith's return.

## Not built (explicitly out of scope for the same-day sprint)

- Real OCR / PDF parsing / LLM inference
- Auth, RBAC, real messaging backend
- Full 250-document search + filter demo
- Tax calculation engine
- First-time client onboarding flow
- Mobile-polished layout beyond avoiding overflow
