# Lovable Update Prompt: Moove — Replace “Next Up” with Days-Until Countdown + Distance (“Mooving X miles away”)

## Goal
Remove the **Next Up** section from Home and replace it with:
1) a **Days Until Moove** countdown (based on a move date), and  
2) a **From / To address** search that calculates distance and displays:  
**“Mooving #### miles away”** (and km if user locale is metric).

This must be responsive and work like a real phone app.

---

## 1) Remove “Next Up” entirely
### Requirements
- Delete the “Next Up” header and list from Home.
- Do not replace it with another task list.

### Acceptance criteria
- Home page has no “Next Up” section.

---

## 2) Add “Days Until Moove” countdown card
### Data model
Add settings fields:
- `move_date` (date, required for countdown)
- `from_address` (string, optional)
- `to_address` (string, optional)
- `from_place_id` (string, optional)
- `to_place_id` (string, optional)
- `distance_miles` (number, optional)
- `distance_km` (number, optional)
- `distance_text` (string, optional, e.g., “12.4 miles”)

### UI (Home)
Add a new section directly under the quick action buttons (or under progress cards if better):
- Title: **Days Until Moove**
- Display:
  - Large number: `N`
  - Subtext:
    - If N > 1: “days to go”
    - If N = 1: “day to go”
    - If N = 0: “It’s Moove day!”
    - If move date missing: “Set your move date in Settings”
- Add a small “Edit” link that navigates to Settings → Move details.

### Calculation rules
- `days_until = ceil((move_date - today) in days)` using user local timezone.
- If date is past, show:
  - “Moove day has passed” and suggest updating date.

### Acceptance criteria
- Countdown updates correctly and handles edge cases (today/past/missing).

---

## 3) Add From/To address search + distance calculation
### UI (Home)
Add a section below the countdown:

**Title:** “Your Moove”  
**Inputs:**
- From: address search field (autocomplete)
- To: address search field (autocomplete)

**Result area (after both selected):**
- Primary line (exact format):
  - **“Mooving {####} miles away”**
- Secondary line:
  - Show km as well in smaller text if available: “({####} km)”
- Optional microcopy:
  - “Distance is approximate.”

### Address search behavior
- Use an address autocomplete API so users can type and select a suggestion.
- Store selected place identifiers and full formatted addresses.

### Distance calculation
- Use the correct APIs:
  - Autocomplete + place details for the addresses (to get lat/lng)
  - Distance calculation using a routing API (driving route by default)
- Display distance based on route distance (not straight-line), and round nicely:
  - If < 10 miles: 1 decimal (e.g., 6.4)
  - If >= 10 miles: nearest whole number (e.g., 124)

### Locale handling
- If user locale is metric (AU, EU, etc.), still show the required phrase with miles **but** also show km:
  - “Mooving 124 miles away (200 km)”
- If you must choose one, prioritize the exact requested phrase (miles) and add km in parentheses.

### Error handling
- If either address is missing: hide distance output.
- If API fails: show a friendly error toast (with X close button):
  - “Couldn’t calculate distance right now. Try again.”

### Acceptance criteria
- Both inputs autocomplete and allow selection.
- Once both are selected, distance is calculated and displayed in the required phrase.
- Distance updates whenever user changes either address.

---

## 4) Settings additions (Move details)
Add a “Move details” section in Settings with:
- Move date picker (required for countdown)
- From address field (same autocomplete)
- To address field (same autocomplete)
- Button: “Recalculate distance”
- Button: “Clear addresses”

### Acceptance criteria
- Users can set move date and addresses from Settings as well as Home.
- Home reflects these values immediately.

---

## 5) API requirement (implementation guidance)
Use a reputable mapping stack with:
- Address Autocomplete
- Place details (lat/lng)
- Route distance calculation

Implement via serverless/proxy if needed to protect API keys (recommended).
Cache last successful distance result locally to avoid repeated calls.

### Acceptance criteria
- Uses proper mapping APIs (autocomplete + routing distance), not manual parsing.
- No API keys exposed in the client if avoidable.

---

## 6) Responsive layout rules
- On small phones:
  - Stack From and To fields vertically.
  - Distance result appears as a compact card below.
- On larger screens:
  - From/To can sit side-by-side, but must not shrink tap targets.
- Inputs must remain visible above keyboard; scroll if necessary.

### Acceptance criteria
- No clipping/overlap on any device size.
- Works smoothly with keyboard open.

---

## Final acceptance checklist
- [ ] Next Up removed from Home
- [ ] “Days Until Moove” countdown implemented and correct
- [ ] From/To address autocomplete implemented
- [ ] Distance calculated via routing API and displayed as “Mooving #### miles away”
- [ ] Settings has Move details (date + addresses) and updates Home
- [ ] Fully responsive + phone-first behavior
- [ ] Errors use toast with X close button