# Lovable Update Prompt: Moove — Upgrade **Home** to “Moove Command Center” (Sticky Hero + Readiness Ring + Today’s 3 Moves + Milestones + Distance)

## Goal
Redesign the **Home** page to deliver clear daily value with a clean, phone-first layout:

1) **Sticky hero greeting + Moo (banner stays fixed)**  
2) **Moove Readiness ring** (single score)  
3) **Today’s 3 Moves** (exactly 3 suggested actions, max)  
4) **Countdown + Milestones** (compact, time-based guidance)  
5) **Distance card** (“Mooving ### miles away”)

Keep the UI minimal, responsive, and on-brand (Highland Cow theme, default dark mode). No scope creep.

---

## 1) Home Layout (new structure)
### Sticky header area (frozen)
- Keep existing Home hero banner (CowHome.png) and greeting:
  - `Let’s Moove,`
  - `<Name>`
- Header must remain sticky like other banners. Content scrolls beneath.

### Scrollable content order (exact)
1. **Moove Readiness**
2. **Today’s 3 Moves**
3. **Days Until Moove + Milestones**
4. **Distance card**

---

## 2) Moove Readiness Ring (single score)
### Purpose
Replace multiple small progress cards with one meaningful “how ready am I?” indicator.

### Calculation (derived)
Compute 3 sub-scores (0–100):
- **Boxes readiness**
  - Move Out mode: `packed_boxes / total_boxes`
  - Packed boxes = boxes with status **Packed** (sealed=true)
- **Address readiness**
  - `done_address_items / total_address_items`
- **Checklist readiness**
  - `done_tasks / total_tasks`

Overall readiness:
- If any total is 0, treat that sub-score as 0 (but show “add your first…” hint).
- Weighted average:
  - Boxes 50%
  - Address 25%
  - Checklist 25%

Display:
- Large ring progress with percent:
  - `You’re {X}% Moove-ready`
- Under-ring microcopy (dynamic):
  - If total boxes = 0: “Add your first box to start tracking.”
  - Else if X < 30: “Start small. One box at a time.”
  - Else if X < 70: “Nice pace. Keep sealing boxes.”
  - Else: “You’re nearly ready to Moove.”

### Interaction
- Tap the readiness ring opens a bottom sheet: “What’s holding you back”
  - Show top 3 blockers (simple):
    - Example: “2 boxes still Empty”, “4 address changes remaining”, “3 checklist tasks left”
  - Each blocker has a CTA button linking to the relevant tab.

### Acceptance criteria
- Home shows a single readiness ring and not multiple redundant progress cards.
- Ring percent updates based on real data.
- Tapping ring shows top blockers + deep links.

---

## 3) Today’s 3 Moves (exactly 3 cards)
### Purpose
Give the user direction without overwhelming them.

### Rules
Always display **exactly 3 suggestions** (unless the user is 100% ready, then show a celebration state with 1–2 suggestions max).

Generate suggestions from simple heuristics (no AI required):

#### Priority pool (choose top 3)
**Boxes suggestions**
- If total boxes = 0 → “Add your first box”
  - CTA: Add Box (opens create)
- Else if there are Empty boxes → “Add 3 items to {firstEmptyBoxLabel}”
  - CTA: Open that box
- Else if there are Packing boxes (open with items) → “Seal {mostPackedBoxLabel} when you’re done”
  - CTA: Open box

**Address suggestions**
- If any AddressChangeItem status = To do → “Update {firstRemainingCategory}”
  - CTA: Open Address tab and auto-open that category accordion

**Checklist suggestions**
- If any ChecklistTask status = To do → “Tick off: {firstRemainingTaskTitle}”
  - CTA: Open Checklist tab

#### Selection logic
- Always try to include at least:
  - 1 Boxes-related task (if boxes exist or needed)
  - 1 Address or Checklist task (whichever has more remaining)
- If there are no address items and no checklist tasks yet, fill remaining slots with Boxes tasks.

### Card design (each)
- Small Moo icon/emoji-style graphic (consistent, not generic icons)
- Title (action-oriented)
- One-line helper text
- CTA button (“Go” / “Open”)

### Acceptance criteria
- Exactly 3 cards appear (unless 100% ready).
- Each card deep-links to the correct tab/box/category.
- Suggestions update as data changes.

---

## 4) Days Until Moove + Milestones (compact)
### Days Until Moove
Keep the existing “Days Until Moove” card, but make it slightly smaller and paired with milestones.

- If move date missing:
  - Show empty state: “Set your move date to get a countdown.”
  - CTA: Edit in Settings

### Milestones (3 checkpoints)
Show a compact timeline with three milestones relative to move date:
- **T-30**: “Pack non-essentials”
- **T-14**: “Addresses + utilities”
- **T-3**: “Cleaning + keys”

Each milestone shows a small status chip computed from readiness:
- If overall readiness >= expected threshold for that time window → “On track”
- Else → “Needs attention”

Simple thresholds:
- If days_until > 30: no warning chips; show “Plenty of time.”
- 30–15 days: expect readiness >= 25%
- 14–4 days: expect readiness >= 55%
- 3–0 days: expect readiness >= 80%

### Acceptance criteria
- Countdown remains visible.
- Milestones are compact and meaningful.
- Chips change based on readiness + days remaining.

---

## 5) Distance Card (keep simple)
Home shows only:
- `Mooving {###} miles away`
- `({###} km)` in smaller text
- Microcopy: “Distance is approximate.”
- Link: “Edit in Settings” (goes to Settings → Move details)

If distance missing:
- “Set From and To addresses in Settings to see distance.”
- CTA: Set addresses

### Acceptance criteria
- No From/To fields on Home.
- Distance displayed exactly as requested.

---

## 6) Visual + responsiveness requirements
- Default dark mode, high contrast.
- Responsive layout:
  - Small phones: single column, stacked sections, no clipping.
  - Larger screens: keep max-width container, comfortable spacing.
- Keep banners sticky, content scrollable.
- Ensure the Ask Moove button does not cover CTAs:
  - Add bottom padding or shift FAB up when near buttons.

### Acceptance criteria
- Home feels like a “command center” but remains uncluttered.
- All sections responsive and usable one-handed.

---

## 7) Non-goals (do not add)
- No new tabs
- No extra analytics screens
- No notifications system
- No calendar integrations

---

## Final checklist
- [ ] Sticky Home hero banner with CowHome.png + greeting
- [ ] Moove Readiness ring (weighted score + bottom sheet blockers)
- [ ] Today’s 3 Moves (exactly 3 actionable cards with deep links)
- [ ] Countdown + 3 Milestones (compact)
- [ ] Distance card only (no From/To inputs)
- [ ] Fully responsive + dark mode polished