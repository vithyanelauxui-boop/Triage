# Predigle — Role-Based Dashboard
## Role: Doctor (Cardiologist, outpatient clinic)

---

## 1. Dashboard purpose

**Who is the user?**
Dr. Anand Kumar, a consulting cardiologist running an outpatient clinic. He sees 8–12 patients a day in
short slots, moves between consult room and ward, and opens the dashboard between patients — often for
under 30 seconds at a time. He is not an administrator; he is a clinician who is legally accountable for
every result he signs.

**Top 3 goals when opening the dashboard**

1. **"Is anyone in danger right now?"** — Catch critical results (a potassium of 6.2, a BP spiking
   post-angioplasty) before they become an adverse event.
2. **"Who am I seeing next, and am I prepared?"** — Know the next patient and their relevant history,
   vitals, and allergies without opening four other screens.
3. **"What is waiting on my signature?"** — Clear the async queue (lab sign-offs, imaging approvals,
   prescription renewals) that blocks pharmacists, radiologists, and patients downstream.

**What problems does this solve?**
In a typical EMR these three questions live in three unconnected modules. The doctor pays a context-switching
tax on every patient, and critical values are discovered by chance rather than by design. This dashboard
collapses them into one triage surface, so the highest-stakes information is the first thing seen — never
something that has to be hunted for.

---

## 2. Information architecture

**Navigation structure — persistent left sidebar**
A sidebar was chosen over top tabs because the nav has 9 destinations (too many for a top bar), needs
persistent unread/pending counts, and must stay visible while the doctor scans dense content. Items are
grouped by mental model, not alphabetically:

| Group | Items | Why grouped |
|---|---|---|
| *(primary)* | Dashboard, Appointments, Patients | Daily-use destinations |
| **Clinical** | Lab Results, Prescriptions, Tasks | Things carrying clinical liability |
| **Practice** | Reports, Messages | Administrative, lower urgency |
| *(footer)* | Settings, Doctor identity + duty status | Rarely changed; identity anchored bottom |

The sidebar collapses to icons for small screens and becomes a drawer below `768px`. A global patient
search sits in the top bar (⌘K) because searching by name/ID/phone is the single most frequent action
that is *not* a navigation.

**Priority of information (what appears first, and why)**

| # | Section | Why it sits here |
|---|---|---|
| 1 | **Clinic overview (KPIs)** | Answers "is today on track?" in one glance, with 7-day sparklines so a number can be judged as improving or worsening. |
| 2 | **Needs your attention** | Highest clinical stakes → highest position. Nothing is allowed to outrank a critical result. |
| 3 | **Up next** | The immediate action. Placed directly below triage so the doctor moves from "any emergencies?" to "start work." |
| 4 | **Today's schedule** | Context for the rest of the day; scanned, not acted on constantly. |
| 5 | **Awaiting my sign-off** | Async, must-not-forget work. Right column — important but not time-critical to the current minute. |
| 6 | **Recent activity** | Audit trail. Confirms what was just signed and allows fast undo. |
| 7 | **Quick actions** | Doctor-initiated shortcuts. Deliberately last: the doctor comes here knowing what they want. |

---

## 3. Key components (and why each exists)

**Overview / KPI strip** — Patients today · Critical results · Awaiting sign-off · Avg. wait time.
Each carries a 7-day sparkline and a delta. *Why:* a bare number ("5 pending") is not decision-useful;
a doctor needs to know if the backlog is growing. Colour is applied by **meaning, not direction** —
a rising wait time is red, a falling critical count is green.

**Needs your attention (alerts, critical vs non-critical)** — A triage list with a coloured severity rail,
segmented `All / Critical / Urgent` filter, the actual lab value rendered at large size beside its
reference range, and a "why this matters" line. *Why:* this is the assignment's critical-vs-non-critical
requirement, but treated as a patient-safety problem. The original wireframe showed "2" while hiding 6
more behind *View all (8)* — a critical result must never be one click from being missed. Here every
severity tier is counted, filterable, and always on screen.

**Up next (patient activity + context)** — Patient identity, waiting time, vitals, allergies, insurance,
and a warning strip listing what still needs review *before* the consult starts.
*Why:* it prevents the doctor from walking into a consultation unaware that imaging is still unapproved.

**Today's schedule (appointments)** — Status-tabbed table (All/Waiting/In progress/Completed/Missed) with
risk flags carried onto each row and row actions revealed on hover.
*Why:* tabs let the doctor filter to "who is waiting" instantly. Hover-revealed actions keep 8 rows
scannable instead of 8 competing buttons — the row itself is the primary target.

**Awaiting my sign-off (tasks)** — Priority-ranked with explicit deadlines ("Before 10:00").
*Why:* a priority label alone doesn't tell you what to do first; a deadline tied to clinic time does.

**Recent actions / history** — Timeline of the last 2 hours with undo on recent entries.
*Why:* this was entirely missing from the original design. Clinicians need to confirm what they signed,
and a mis-signed report must be reversible quickly.

**Search / quick action entry** — Global ⌘K search plus a 6-item quick action grid.
*Why:* covers the two entry patterns — "I know the patient" (search) and "I know the task" (quick action).

---

## 4. Key UX decisions and changes made

| Change from the original wireframe | Reasoning |
|---|---|
| Added a KPI overview strip | The brief requires summary stats; the original had none. |
| Critical alerts never collapsed behind "View all" | Patient-safety: discovery must not depend on curiosity. |
| Added explicit Critical / Urgent tiers with counts | The brief asks for critical vs non-critical as a real structure, not just colour. |
| Added Recent Activity | Required "recent actions or history"; also enables error recovery. |
| Lab values shown with reference ranges | "6.2 mmol/L" is only meaningful next to "Ref 3.5–5.1". |
| Merged the duplicate Next Patient / first schedule row | The original showed Maria Garcia twice above the fold. |
| Row actions on hover | Reduces visual noise so status can be scanned down the column. |
| Deadlines on pending tasks | Converts a vague priority into a schedulable decision. |
| Duty status in the sidebar | In shared-device clinics, who is signed in is a clinical safety fact. |

---

## 5. User flow

**Primary flow — the 30-second triage loop**

```
Open dashboard
      │
      ▼
Scan KPI strip ──── "Critical results: 2" ────┐
      │                                        │
      ▼                                        ▼
Any critical alerts?  ──── No ────► Read "Up next" card
      │ Yes                               │
      ▼                                   ▼
Open triage list                    Vitals / allergies / open items OK?
      │                                   │           │
      ▼                                   │ No        │ Yes
Review value vs reference range           ▼           ▼
      │                            Resolve blocker   Start consultation
      ▼                                   │                │
Act (sign / order / escalate)             └────────────────┘
      │                                            │
      ▼                                            ▼
Logged to Recent Activity ◄──────────── Consultation complete
      │                                            │
      ▼                                            ▼
Alert count decrements              Schedule row flips to "Completed"
                                                   │
                                                   ▼
                                        Return to dashboard → next patient
```

**Secondary flow — clearing the sign-off queue (between patients)**

```
"Awaiting my sign-off: 5"  →  Sort by deadline  →  Open highest priority
        →  Review  →  Sign  →  Logged to Recent Activity (undo available)
        →  Counter decrements  →  Repeat until clear
```

---

## 6. Design system

Built entirely on the **Supabase design language** (`DESIGN.md`), implemented with shadcn/ui + Radix
primitives. Chosen over the alternatives because Supabase's own product is a dense, data-heavy admin
dashboard — the closest structural match to clinical software — and its white-canvas, single-accent
system leaves colour free to carry clinical meaning.

- **Canvas** `#ffffff` · **Ink** `#171717` · **Emerald accent** `#3ecf8e` with near-black labels
  (the brand's signature inversion)
- **Radii** 6px buttons/inputs, 12px cards — square-ish and technical, never pill
- **Type** Inter, tight negative tracking on display sizes
- **Elevation** hairline-led; borders before shadows

**One deliberate extension:** a clinical severity scale (critical / urgent / success / info) was added.
Supabase's palette reserves colour almost entirely for the emerald accent, but in medical software
colour must encode risk — a critical potassium cannot look the same as a routine follow-up. Severity
colour is used only for clinical state, never decoration, so the accent stays meaningful.
