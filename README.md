# Triage — Doctor Dashboard

A role-based clinical dashboard for the **Doctor** role, built for the Triage / Esper Group design
assessment. Working React application, not a mockup.

**[→ Full UX rationale and user flow](./UX-RATIONALE.md)**

---

## The problem

A consulting cardiologist opens this dashboard between patients — often for under 30 seconds — and needs
three questions answered immediately:

1. **Is anyone in danger right now?** (critical labs, vitals, imaging)
2. **Who am I seeing next, and am I prepared?**
3. **What is waiting on my signature?**

In a typical EMR those three questions live in three unconnected modules. This dashboard collapses them
into a single triage surface, ordered so that the highest-stakes information is the first thing seen.

## Screens

| Section | Purpose |
|---|---|
| Clinic overview | 4 KPIs with 7-day sparklines and deltas — is today on track? |
| Needs your attention | Critical vs urgent triage list with lab values against reference ranges |
| Up next | Next patient with vitals, allergies, and pre-consult blockers |
| Today's schedule | Status-tabbed appointment table with risk flags |
| Awaiting my sign-off | Deadline-ranked pending clinical decisions |
| Recent activity | Audit trail of the last 2 hours, with undo |
| Quick actions | Six doctor-initiated shortcuts |

## Design system

Built on the **Supabase design language** (see [`DESIGN.md`](./DESIGN.md)), implemented with
shadcn/ui + Radix primitives. Every component — sidebar, top bar, tables, badges, sheets, dropdowns —
comes from this one system.

- Canvas `#ffffff` · Ink `#171717` · Emerald accent `#3ecf8e` with near-black labels
- 6px radii on buttons and inputs, 12px on cards — square-ish, never pill
- Inter, with tight negative tracking on display sizes
- Hairline-led elevation: borders before shadows

One deliberate extension: a **clinical severity scale** (critical / urgent / success / info). In medical
software colour has to encode risk — a critical potassium cannot look like a routine follow-up. Severity
colour is used only for clinical state, never decoration.

## Tech

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui (Radix) · Recharts · React Router

## Running locally

```bash
cd app
npm install
npm run dev
```

Then open http://localhost:5173

```bash
npm run build     # production build
npx tsc --noEmit -p tsconfig.app.json   # type-check
```

## Structure

```
app/src
├── components
│   ├── layout/AppShell.tsx      # sidebar, top bar, mobile drawer
│   ├── dashboard/               # KpiStrip, AttentionPanel, NextPatientCard,
│   │                            # ScheduleTable, SidePanels
│   └── ui/                      # shadcn/ui primitives
├── data/dashboard.ts            # typed mock clinical data
└── pages/Dashboard.tsx          # section order = information priority
```

Responsive from 375px up; navigation becomes a drawer below 768px.
