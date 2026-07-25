# TaxFlow AI - Same-Day Vibe Coding Plan

> Goal: ship a hosted, clickable prototype **today** for the AI Engineer case study.
>
> Priority: **frontend UX, interaction design, information architecture, and trust in AI**.
>
> Explicitly out of scope for today: real OCR, real document parsing, real LLM inference, production auth, database, messaging backend, tax calculation engine.

---

## 0. Definition of Done

By the end of today, the app should support this complete demo flow:

1. CPA lands on an actionable dashboard.
2. The dashboard clearly shows what needs attention first.
3. CPA opens **John Smith - 2025 Individual Return**.
4. CPA sees return progress, blockers, owner, and open AI issues.
5. CPA opens an AI-flagged field.
6. CPA sees the extracted value, confidence, reason, source document, source location, and any transformation/calculation.
7. CPA opens the source evidence in a side-by-side review.
8. CPA corrects or approves the value.
9. The field status updates immediately.
10. Open issue count decreases and the dashboard/return state reflects the change.
11. Optional if time allows: role switch, client view, contextual messages, filters/search.

### Minimum deliverables

- Hosted prototype link
- Working interactions, not static screenshots
- README explaining what is real vs simulated
- Short walkthrough video

---

# 1. Today’s Scope

## P0 - Must Ship

These are the only features required before polishing anything else.

### Challenge 07 - Actionable Dashboard
- Priority queue
- "What should I work on right now?"
- Return list with status, urgency, issues, owner, action
- Simple ranking logic using mock data

### Challenge 06 - Return Status & Progress
- Current stage
- Completed stages
- Next step
- Next owner
- Blocker
- Progress percentage

### Challenge 08 - Clickable vs Editable
- AI-generated
- Verified
- Needs review
- Editable
- Approval required
- Locked/read-only

### Challenge 01 - Source Document Traceability
- Return field
- Extracted value
- Source document
- Page/section
- Raw source value
- Transformation/calculation

### Challenge 10 - Trustworthy AI
- What AI did
- Why
- Evidence
- Confidence/uncertainty
- Recommended action
- Correction workflow

---

## P1 - Add Only After P0 Works End-to-End

### Challenge 04 - Navigation / Context
- Breadcrumbs
- Back to review queue
- Related objects
- Deep-linkable routes

### Challenge 05 - Role-Aware Experience
- CPA role
- Client role
- Role switch
- Different navigation by role

### Challenge 02 - Collaboration
- Contextual thread attached to an issue
- Client-visible message
- Internal note
- Owner / next action

---

## P2 - Stretch Goals

### Challenge 09 - Complexity at Scale
- 200+ mock documents
- Search
- Filters
- Progressive disclosure

### Challenge 03 - First-Time Client Experience
- First login
- Single obvious next action
- Onboarding progress

Do not start P2 unless P0 and P1 are stable.

---

# 2. Tech Stack

Use the fastest stack possible.

```text
React
Vite
TypeScript
Tailwind CSS
shadcn/ui
Lucide React
React Router
```

No backend.

No database.

All data should live in local TypeScript files or component state.

Optional:

```text
localStorage
```

Use localStorage only if preserving edits after refresh is trivial. Otherwise skip it.

---

# 3. Project Structure

```text
taxflow-ai/
│
├── src/
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── FieldStateBadge.tsx
│   │   ├── AIConfidence.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── ProgressTimeline.tsx
│   │   ├── SourceTracePanel.tsx
│   │   ├── AIReviewPanel.tsx
│   │   └── CorrectionDialog.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── ReturnDetail.tsx
│   │   ├── DocumentReview.tsx
│   │   ├── ClientHome.tsx
│   │   └── Documents.tsx
│   │
│   ├── data/
│   │   ├── returns.ts
│   │   ├── fields.ts
│   │   ├── documents.ts
│   │   ├── aiResults.ts
│   │   ├── tasks.ts
│   │   └── messages.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── lib/
│   │   ├── priority.ts
│   │   └── mockAI.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
│   └── mock-documents/
│       ├── w2.png
│       ├── 1099-int-chase.png
│       ├── 1099-int-fidelity.png
│       └── 1098.png
│
└── README.md
```

---

# 4. Mock Data Model

Keep the model simple. It only needs to support the demo.

## TaxReturn

```ts
export type TaxReturn = {
  id: string;
  client: string;
  year: number;
  type: string;
  status: "Needs Review" | "Waiting on Client" | "Ready for Review" | "Completed";
  progress: number;
  owner: string;
  openIssues: number;
  blocker?: string;
  daysToDeadline: number;
};
```

## TaxField

```ts
export type TaxField = {
  id: string;
  returnId: string;
  section: string;
  label: string;
  value: number | null;
  displayValue: string;
  state: "ai" | "verified" | "needs_review" | "editable" | "locked";
  aiResultId?: string;
};
```

## AIResult

```ts
export type AIResult = {
  id: string;
  fieldId: string;
  confidence: number;
  recommendation: string;
  reason: string;
  evidenceIds: string[];
  transformation?: {
    type: "direct" | "sum" | "manual";
    formula?: string;
  };
};
```

## Evidence

```ts
export type Evidence = {
  id: string;
  documentId: string;
  documentName: string;
  page: number;
  section: string;
  rawValue: string;
};
```

---

# 5. Core Demo Dataset

Use **John Smith** as the main demo return.

## Return A - John Smith

```text
John Smith
2025 Individual Return
Status: Needs Review
Progress: 72%
Owner: Sarah Chen
Open issues: 3
Deadline: 4 days
Blocker: Missing 1099-DIV
```

## Fields

### Wages

```text
$85,240
State: Verified
Confidence: 98%
Source: Acme Corp W-2
Page 1
Section: Box 1
Transformation: Direct extraction
```

### Interest Income

```text
$4,820
State: Needs Review
Confidence: 87%
Sources:
- Chase 1099-INT: $1,820
- Fidelity 1099-INT: $3,000
Transformation:
$1,820 + $3,000 = $4,820
```

### Mortgage Interest

```text
AI value: $14,320
Correct value: $14,230
State: Needs Review
Confidence: 61%
Source: Form 1098
Page 1
Section: Box 1
Reason: Low-quality scan; final digits ambiguous
```

### Dividend Income

```text
No final value
State: Needs Review
AI warning: Possible missing 1099-DIV
Evidence: Fidelity brokerage statement shows dividend activity
Recommended action: Request document
```

---

# 6. Visual Language

The UI must make state obvious without relying on color alone.

## Field states

```text
✨ AI Generated
✓ Verified
! Needs Review
✎ Editable
● Approval Required
🔒 Locked
```

Use:
- icon
- badge text
- border/background treatment
- hover/cursor behavior

Never use color as the only signal.

---

# 7. Screen 1 - CPA Dashboard

## Purpose

Answer immediately:

> What should I work on right now?

## Layout

### Header

```text
Good morning, Sarah
5 returns need your attention
```

### Priority queue

Card 1:

```text
John Smith
2025 Individual Return
HIGH PRIORITY
3 AI issues
Deadline in 4 days
[Review Return]
```

Card 2:

```text
Lisa Wong
Waiting on Client
Missing 1099-DIV
[View Request]
```

Card 3:

```text
Mike Brown
Ready for Final Review
[Review]
```

### Workload summary

```text
Needs Action       12
Waiting on Client   8
Ready for Review    5
Completed           31
```

### Return table

Columns:

```text
Client
Status
Issues
Deadline
Owner
Action
```

---

# 8. Priority Ranking Logic

Use actual frontend logic instead of hardcoded order.

```ts
export function getPriorityScore(r: TaxReturn) {
  let score = 0;

  if (r.daysToDeadline <= 3) score += 50;
  else if (r.daysToDeadline <= 7) score += 30;
  else if (r.daysToDeadline <= 14) score += 10;

  score += r.openIssues * 10;

  if (r.status === "Needs Review") score += 20;
  if (r.status === "Waiting on Client") score += 10;

  return score;
}
```

Sort descending.

---

# 9. Screen 2 - Return Detail

Route:

```text
/returns/RET-001
```

## Header

```text
John Smith
2025 Individual Return
Needs Review
72% complete
```

## Progress timeline

```text
✓ Documents received
✓ AI processing complete
● CPA review
○ Client clarification
○ Final review
○ Ready to file
```

## Action summary

```text
Next action
Sarah Chen
Review 3 AI flagged fields
```

```text
Blocking completion
1 missing 1099-DIV
```

## Tax sections

### Income

```text
Wages                 $85,240    ✓ Verified
Interest Income        $4,820    ! Needs Review
Dividend Income             —    ! Missing Document
Capital Gains          $9,310    ✓ Verified
```

### Deductions

```text
Mortgage Interest     $14,320    ! Needs Review
```

Collapse less important sections.

---

# 10. Screen 3 - AI Review Drawer

Clicking a field opens a right-side panel.

## Interest Income Example

```text
Interest Income
$4,820

AI confidence
87%

What AI did
Combined interest reported across two 1099-INT documents.

Why
Both documents map to taxable interest income.

Evidence
Chase 1099-INT
Page 1 · Box 1
$1,820

Fidelity 1099-INT
Page 1 · Box 1
$3,000

Calculation
$1,820 + $3,000 = $4,820

Recommended action
Verify the combined value.

[View Evidence]
[Verify]
[Correct]
```

---

# 11. Screen 4 - Side-by-Side Source Review

This is the strongest visual screen in the prototype.

## Layout

```text
┌────────────────────────┬──────────────────────────────┐
│ Return Field           │ Source Document              │
│                        │                              │
│ Interest Income        │ Chase 1099-INT               │
│ $4,820                 │ Page 1                       │
│                        │                              │
│ Evidence               │ [mock document image]        │
│ Chase      $1,820      │                              │
│ Fidelity   $3,000      │ [highlighted source box]     │
│                        │                              │
│ Calculation            │                              │
│ 1820 + 3000 = 4820     │                              │
└────────────────────────┴──────────────────────────────┘
```

No PDF renderer needed.

Use a static image with a positioned highlight overlay.

---

# 12. Screen 5 - Low-Confidence AI Correction

Use Mortgage Interest.

## AI Review

```text
Mortgage Interest

AI extracted value
$14,320

Confidence
61%

Why this needs review
The source image is low quality and the final two digits are ambiguous.

Evidence
Home Loan Form 1098
Page 1 · Box 1

Recommended action
Review the source before approving.

[Review Evidence]
[Accept]
[Correct]
```

## Correction modal

```text
Correct Mortgage Interest

AI value
$14,320

Correct value
[ 14,230 ]

Reason
[ OCR misread ]

Source
Home Loan Form 1098
Page 1 · Box 1

[Cancel]
[Save Correction]
```

After save:

```text
$14,230
✓ Corrected by Sarah Chen
Previous AI value: $14,320
```

Also update:

```text
Open issues: 3 → 2
```

---

# 13. State Management

Keep it simple.

Use React state at App level or a small context.

Suggested state:

```ts
{
  returns,
  fields,
  reviewedFieldIds,
  corrections
}
```

Functions:

```ts
verifyField(fieldId)
correctField(fieldId, newValue, reason)
dismissWarning(fieldId)
```

No Redux.

No Zustand unless already familiar.

---

# 14. Optional P1 - Navigation Context

Add breadcrumb:

```text
Returns > John Smith > Income > Interest Income
```

Add:

```text
← Back to Review Queue
```

In evidence drawer:

```text
Related to
- 2025 Return
- Interest Income
- AI Review Issue
- Review Task
```

Goal: user never loses workflow context.

---

# 15. Optional P1 - Role Switching

Top-right menu:

```text
Sarah Chen
Working as: CPA Preparer ▼
```

Options:

```text
CPA Preparer
Personal Taxpayer
```

## CPA navigation

```text
Dashboard
Clients
Returns
Review Queue
Documents
```

## Client navigation

```text
Home
My Return
Documents
Messages
```

## Client home

```text
Your 2025 return is under CPA review.

Nothing needed from you right now.
```

or:

```text
1 item needs your attention
Upload Fidelity 1099-DIV
[Upload Document]
```

---

# 16. Optional P1 - Contextual Collaboration

Attach communication to an issue instead of building an inbox.

```text
Issue
Missing Fidelity 1099-DIV

Owner
John Smith

Status
Waiting on Client
```

Thread:

```text
Sarah Chen · Jul 21
Could you upload your Fidelity 1099-DIV?
CLIENT VISIBLE
```

```text
John Smith · Jul 22
I haven't received one yet.
```

Internal note:

```text
🔒 INTERNAL NOTE
Brokerage statement suggests dividend activity.
Need to confirm whether a 1099-DIV was issued.
```

---

# 17. Optional P2 - Large Dataset / Search

Generate 250 mock documents.

```ts
Array.from({ length: 250 }, (_, i) => ({
  id: `DOC-${i + 1}`,
  name: `Document ${i + 1}`,
  type: ["W-2", "1099-INT", "1099-DIV", "1098", "K-1"][i % 5],
  status: ["Verified", "Needs Review", "Processed"][i % 3],
}));
```

Filters:

```text
Type
Status
Tax Year
AI Confidence
```

Search by:

```text
filename
form type
client
```

---

# 18. Build Order for Today

Do not jump around.

---

## Block 1 - 45 min
### Bootstrap

- Create Vite app
- Add Tailwind
- Add shadcn/ui
- Add React Router
- Add Lucide
- Build shell

### Exit condition

The app opens and looks like a SaaS product.

---

## Block 2 - 45 min
### Mock Data

Create:

```text
returns.ts
fields.ts
documents.ts
aiResults.ts
```

Add John Smith and 4 supporting fields.

### Exit condition

All screens can be driven from mock data.

---

## Block 3 - 75 min
### Dashboard

Build:
- greeting
- priority queue
- workload summary
- return table
- priority score

### Exit condition

"Review John Smith" works.

---

## Block 4 - 75 min
### Return Detail

Build:
- header
- progress
- blocker
- next action
- tax sections
- field states

### Exit condition

You can click Interest Income and Mortgage Interest.

---

## Block 5 - 90 min
### AI Review + Traceability

Build:
- AI drawer
- confidence
- reason
- evidence
- transformation
- view evidence

### Exit condition

Interest Income shows two sources and calculation.

---

## Block 6 - 60 min
### Side-by-Side Evidence

Build:
- left return context
- right document image
- highlighted source region
- page/box label

### Exit condition

The source trail is visually obvious in under 5 seconds.

---

## Block 7 - 60 min
### Correction Workflow

Build:
- correction dialog
- editable value
- reason
- save
- update state
- issue count decrement

### Exit condition

Mortgage Interest can change from $14,320 to $14,230 and become corrected/verified.

---

## Block 8 - 45 min
### UX Cleanup

Check:
- spacing
- typography
- badges
- icons
- click targets
- hover states
- empty states
- disabled states

Delete every button that does nothing.

---

## Block 9 - 45 min
### P1 Feature

Choose only one first:

1. Navigation context
2. Role switch
3. Collaboration

Recommended order:

```text
Navigation > Role Switch > Collaboration
```

---

## Block 10 - 30 min
### Deploy

- npm run build
- fix errors
- deploy to Vercel
- test direct URLs
- test mobile only enough to avoid obvious breakage

---

## Block 11 - 30 min
### README

Include:

```text
Overview
Implemented flows
Simulated components
Tech stack
Design decisions
How to run locally
```

---

## Block 12 - 30-45 min
### Record Demo

Target length: 5-7 minutes.

---

# 19. Vibe Coding Rules

These rules matter more than the exact tool you use.

## Rule 1 - Ask for one vertical slice at a time

Bad prompt:

> Build the whole tax platform.

Good prompt:

> Build the CPA Dashboard page using the existing shell and mock data. Do not touch other pages.

---

## Rule 2 - Tell the agent what NOT to build

Always state:

```text
Do not add a backend.
Do not add authentication.
Do not call external APIs.
Do not add a database.
Do not redesign unrelated pages.
```

---

## Rule 3 - Preserve working code

At the end of every prompt:

```text
Keep all existing working functionality intact.
Make the smallest coherent set of changes needed.
```

---

## Rule 4 - Build behavior before beauty

Order:

```text
route
→ data
→ interaction
→ state update
→ visual polish
```

Never reverse it.

---

## Rule 5 - Every visible control must work

Before finalizing a screen:

```text
If a control has no behavior, either implement it or remove it.
```

---

# 20. Copy-Paste Vibe Coding Prompts

Use these in sequence.

---

## Prompt 1 - Bootstrap Project

```text
I am building a same-day clickable frontend prototype for an AI-powered tax platform.

Create a clean React + Vite + TypeScript app using Tailwind CSS, shadcn/ui, Lucide React, and React Router.

The product name is TaxFlow AI.

Build a professional SaaS shell with:
- left sidebar
- top bar
- main content area
- responsive layout

CPA sidebar navigation:
- Dashboard
- Returns
- Clients
- Documents
- Tasks
- Messages

Top bar:
- search affordance
- notifications icon
- user menu showing Sarah Chen
- role label: CPA Preparer

Use a restrained professional tax/accounting product aesthetic. Avoid gradients, giant hero sections, excessive rounded cards, or marketing-page styling.

Do not add a backend.
Do not add auth.
Do not call APIs.
Do not build other product functionality yet.

Keep the architecture simple and easy to extend today.
```

---

## Prompt 2 - Add Mock Data

```text
Add a typed mock-data layer for the TaxFlow AI prototype.

Create TypeScript types and local mock data for:
- tax returns
- tax fields
- documents
- AI results
- evidence

Use John Smith as the primary demo return:
- 2025 Individual Return
- Needs Review
- 72% complete
- owner Sarah Chen
- 3 open issues
- deadline in 4 days
- blocker: Missing 1099-DIV

Fields:
1. Wages: $85,240, verified, 98% confidence, Acme Corp W-2 page 1 box 1
2. Interest Income: $4,820, needs review, 87% confidence, derived from Chase $1,820 + Fidelity $3,000
3. Mortgage Interest: AI extracted $14,320, needs review, 61% confidence, correct value will later be $14,230, Form 1098 page 1 box 1
4. Dividend Income: missing document / AI warning for possible missing 1099-DIV

Also create 4 additional returns in varied statuses for dashboard use.

Keep all data local in src/data. No backend or API.
```

---

## Prompt 3 - Dashboard

```text
Build the CPA Dashboard page for TaxFlow AI using the existing mock data.

The page must answer: "What should I work on right now?"

Include:
1. Header: "Good morning, Sarah" and count of returns needing attention.
2. Priority queue with the 3 most urgent items.
3. John Smith must appear as the first item with:
   - 2025 Individual Return
   - High Priority
   - 3 AI issues
   - deadline in 4 days
   - Review Return button
4. Workload summary counts:
   - Needs Action
   - Waiting on Client
   - Ready for Review
   - Completed
5. Return table with columns:
   - Client
   - Status
   - Issues
   - Deadline
   - Owner
   - Action

Implement a real frontend priority-score function based on deadline, issue count, and status, and sort the queue by that score.

Clicking Review Return for John Smith must navigate to /returns/RET-001.

Do not redesign the shell.
Do not add charts.
Do not add backend code.
Keep existing functionality intact.
```

---

## Prompt 4 - Return Detail

```text
Build /returns/RET-001 as the main CPA return-review workspace for John Smith.

Header:
- John Smith
- 2025 Individual Return
- Needs Review
- 72% complete

Add a clear process timeline:
- Documents received - complete
- AI processing complete - complete
- CPA review - current
- Client clarification - upcoming
- Final review - upcoming
- Ready to file - upcoming

Add two summary cards:
- Next action: Sarah Chen, review 3 AI flagged fields
- Blocking completion: 1 missing 1099-DIV

Add tax sections, starting with Income and Deductions.

Fields:
Income:
- Wages $85,240 - Verified
- Interest Income $4,820 - Needs Review
- Dividend Income — - Missing Document
- Capital Gains $9,310 - Verified

Deductions:
- Mortgage Interest $14,320 - Needs Review

Create a consistent visual system for:
- AI Generated
- Verified
- Needs Review
- Editable
- Approval Required
- Locked

Use icons + labels, not color alone.

Interest Income and Mortgage Interest must be clickable.
Do not implement their detail panel yet.
```

---

## Prompt 5 - AI Review Drawer

```text
Add a reusable right-side AI Review drawer to the return workspace.

When Interest Income is clicked, open the drawer showing:
- field: Interest Income
- value: $4,820
- AI confidence: 87%
- What AI did: combined interest reported across two 1099-INT documents
- Why: both documents map to taxable interest income
- Evidence 1: Chase 1099-INT, page 1, box 1, $1,820
- Evidence 2: Fidelity 1099-INT, page 1, box 1, $3,000
- Calculation: $1,820 + $3,000 = $4,820
- Recommended action: Verify the combined value

Buttons:
- View Evidence
- Verify
- Correct

The drawer should prioritize clarity and evidence, not technical AI details.

The Verify button should update the field state to Verified in React state.

Do not add external AI calls.
Do not add backend code.
```

---

## Prompt 6 - Source Traceability

```text
Implement the View Evidence interaction for Interest Income.

Create a side-by-side source review screen or modal.

Left side:
- Return Field: Interest Income
- Final value: $4,820
- source list
- Chase $1,820
- Fidelity $3,000
- transformation: 1820 + 3000 = 4820

Right side:
- show a mock tax document image from public/mock-documents
- show document name
- page number
- source section / box
- add a visible highlight rectangle over the relevant source value

Allow switching between the Chase and Fidelity evidence items.

The relationship between final return value and source evidence should be understandable within seconds.

No PDF parser.
No OCR.
No backend.
Use static images and hardcoded coordinates.
```

---

## Prompt 7 - Mortgage AI Warning

```text
Add the AI Review flow for Mortgage Interest.

When clicked, show:
- AI extracted value: $14,320
- confidence: 61%
- warning state: Needs Review
- reason: source image is low quality and final digits are ambiguous
- evidence: Home Loan Form 1098, page 1, box 1
- recommended action: review the source before approving

Buttons:
- Review Evidence
- Accept
- Correct

Use the same AI Review component architecture as Interest Income.
Do not duplicate unrelated UI.
```

---

## Prompt 8 - Correction Workflow

```text
Implement the Correct flow for Mortgage Interest.

Clicking Correct should open a dialog with:
- AI value: $14,320
- editable Correct Value input
- default/target corrected value: $14,230
- Reason selector or input
- example reason: OCR misread
- source reference: Home Loan Form 1098, page 1, box 1

Actions:
- Cancel
- Save Correction

After Save Correction:
- field value becomes $14,230
- field state becomes corrected/verified
- show "Corrected by Sarah Chen"
- preserve "Previous AI value: $14,320"
- John Smith open issue count changes from 3 to 2
- the return detail UI updates immediately
- dashboard data should also reflect the reduced issue count if state is shared

Keep everything frontend-only.
```

---

## Prompt 9 - Navigation Context

```text
Improve navigation and orientation without redesigning the app.

Add breadcrumbs to the return workflow:
Returns > John Smith > Income > Interest Income

When the user enters from the dashboard review queue, show:
← Back to Review Queue

In the AI/evidence panel, add a compact Related To section:
- 2025 Return
- Interest Income
- AI Review Issue
- Review Task

Preserve the user's workflow context when opening and closing drawers/modals.
```

---

## Prompt 10 - Role Switch

```text
Add a simple role switcher to the top-right user menu.

Roles:
- CPA Preparer
- Personal Taxpayer

CPA navigation:
- Dashboard
- Clients
- Returns
- Review Queue
- Documents

Personal Taxpayer navigation:
- Home
- My Return
- Documents
- Messages

Create a simple ClientHome page showing:
- "Your 2025 return is under CPA review"
- either "Nothing needed from you right now" or one action card asking for Fidelity 1099-DIV

The active role must be visually obvious so a firm employee cannot confuse firm work with their personal return.

No real permissions or authentication.
```

---

## Prompt 11 - Final UX Audit

```text
Audit the TaxFlow AI prototype for consistency and usability.

Do not redesign the product.

Check and fix:
- inconsistent spacing
- inconsistent typography
- badge naming
- button hierarchy
- hover/focus states
- clickable vs non-clickable affordances
- disabled/read-only states
- empty-state wording
- alignment
- accidental horizontal overflow
- buttons that do nothing

Rules:
- Every visible interactive control must either work or be removed.
- Do not rely on color alone for state.
- Keep the interface professional and restrained.
- Preserve all current working flows.
```

---

## Prompt 12 - README

```text
Create a concise README.md for this case study prototype.

Include:
1. Overview
2. Key UX goals
3. Implemented interactions
4. Simulated components
5. Tech stack
6. Running locally
7. Design decisions

Clearly state that these are simulated:
- OCR
- document parsing
- AI inference
- authentication
- messaging backend
- tax calculations

Clearly state which frontend behaviors are real:
- priority ranking
- route navigation
- status changes
- source traceability interactions
- AI review drawer
- verification/correction flow
- issue-count update
- role switching if implemented

Keep it concise and reviewer-friendly.
```

---

# 21. Acceptance Checklist Before Deploy

## Dashboard

- [ ] John Smith is visibly highest priority
- [ ] Priority is calculated, not just manually ordered
- [ ] Review Return navigates correctly
- [ ] Table is readable

## Return Detail

- [ ] Stage is obvious
- [ ] Next action is obvious
- [ ] Owner is obvious
- [ ] Blocker is obvious
- [ ] Field states are consistent

## Traceability

- [ ] Return field visible
- [ ] Final value visible
- [ ] Document name visible
- [ ] Page visible
- [ ] Section/box visible
- [ ] Raw value visible
- [ ] Transformation visible when needed

## AI Trust

- [ ] What AI did
- [ ] Why
- [ ] Evidence
- [ ] Confidence
- [ ] Recommended next action
- [ ] Correction path

## Correction

- [ ] Correct button works
- [ ] Value changes
- [ ] Previous AI value remains visible
- [ ] Reviewer identity shown
- [ ] Issue count decreases

## General UX

- [ ] No dead buttons
- [ ] No broken routes
- [ ] No console-breaking errors
- [ ] No obvious overflow
- [ ] UI states are not color-only
- [ ] Back navigation makes sense

---

# 22. What NOT to Spend Time On Today

Do not build:

```text
real OCR
real PDF parsing
RAG
vector database
LLM agents
OpenAI API integration
AWS deployment architecture
Postgres
authentication
RBAC backend
WebSockets
real chat
real file upload processing
real tax calculations
unit-test suite beyond critical helpers
complex animations
custom design system
mobile-perfect experience
```

The case study is about whether the frontend communicates complex tax + AI workflows clearly.

---

# 23. Demo Script

## 0:00 - 0:30

```text
I focused the prototype on three core questions:
What should the CPA work on first?
Can every AI-assisted value be traced back to evidence?
Can the CPA correct AI output without losing workflow context?
```

## 0:30 - 1:30

Dashboard:

```text
The dashboard is action-oriented rather than reporting-oriented.
Returns are ranked using deadline, unresolved issues, and status.
```

Open John Smith.

## 1:30 - 2:30

Return workspace:

```text
The user immediately sees where the return is, what happens next, who owns it, and what's blocking completion.
```

## 2:30 - 3:45

Interest Income:

```text
This value comes from two source documents.
The CPA can see the evidence and exact calculation instead of trusting a black-box AI output.
```

Open side-by-side evidence.

## 3:45 - 5:00

Mortgage Interest:

```text
Here the confidence is lower, so the interface changes from passive confirmation to active review.
```

Correct $14,320 → $14,230.

## 5:00 - 5:30

Show issue count decreasing.

```text
The correction updates the workflow immediately, while preserving the previous AI value for traceability.
```

## 5:30 - 6:00

Optional role switch/navigation.

## 6:00 - 6:30

Close:

```text
The AI, OCR, auth, and document parsing are intentionally simulated.
The working prototype focuses on the interaction model, trust, traceability, prioritization, and correction workflow.
```

---

# 24. Emergency Cut List

If you are behind schedule, cut features in this order:

1. 250-document scale demo
2. Collaboration
3. Role switching
4. Client onboarding
5. Advanced filters
6. Search
7. Notifications
8. Animations

Never cut:

1. Dashboard
2. Return detail
3. AI review
4. Source traceability
5. Correction workflow
6. End-to-end clickable flow

---

# 25. Final Today-Only Strategy

The project is successful if one reviewer can understand this story without explanation:

```text
This return needs attention.
↓
This field is uncertain.
↓
This is what the AI extracted.
↓
This is why.
↓
This is the source evidence.
↓
This is the calculation.
↓
The CPA corrects it.
↓
The workflow updates.
```

Build that story first.

Everything else is optional.
