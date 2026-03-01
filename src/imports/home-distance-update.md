# Lovable Update Prompt: Moove — Home Shows Only “Mooving ### miles away” (Move From/To Inputs to Settings)

## Goal
Simplify the Home page by removing the **From/To address fields** from Home. Home should display **only the distance summary**:

**“Mooving ### miles away”**  
(optionally show km in smaller text)

The From/To address search inputs must live **only in Settings**.

---

## 1) Home page changes
### Remove from Home
- Remove the entire “Your Moove” section UI that contains:
  - From address field
  - To address field
  - Any clear (x) controls for those fields

### Keep on Home (distance-only card)
Replace with a single compact card below “Days Until Moove”:

**Card title (small):** `YOUR MOOVE` (optional)  
**Primary text (large, exact phrase):** `Mooving {###} miles away`  
**Secondary text (small, optional):** `({###} km)`  
**Microcopy (small):** `Distance is approximate.`  
**CTA link (small):** `Edit in Settings`

### Empty / not-set states
- If distance not available yet:
  - Show: “Set your From and To address in Settings to see your moove distance.”
  - CTA: “Set addresses”

### Acceptance criteria
- Home shows **only** the distance summary (no address inputs).
- Home has a clear “Edit in Settings” link for distance configuration.

---

## 2) Settings becomes the single source of truth for addresses
### Settings: Move details section
Add/keep a Settings section: **Move details**
- Move date picker (for Days Until Moove)
- From address autocomplete input
- To address autocomplete input
- Button: “Recalculate distance”
- Button: “Clear addresses”

### Behavior
- When user selects From and To in Settings:
  - Persist formatted addresses + place IDs
  - Automatically compute distance and store:
    - `distance_miles`, `distance_km`, `distance_text`
- Home reads and displays the stored distance values only.

### Acceptance criteria
- Addresses can only be edited in Settings.
- Distance updates after changes in Settings and reflects on Home.

---

## 3) Data + calculation rules (unchanged, but centralized)
- Keep stored fields:
  - `from_address`, `to_address`, `from_place_id`, `to_place_id`
  - `distance_miles`, `distance_km`
- Distance should be routing distance (driving route by default) using appropriate mapping APIs.
- Formatting:
  - < 10 miles: 1 decimal
  - >= 10 miles: round to whole miles
- Always display the required phrase in miles, and show km in parentheses (especially for AU).

### Acceptance criteria
- Distance shown on Home is accurate and updates when Settings changes.

---

## Final checklist
- [ ] Home: From/To address inputs removed
- [ ] Home: distance-only card shows “Mooving ### miles away” + optional km
- [ ] Settings: From/To address search exists and is the only place to edit
- [ ] Home: “Edit in Settings” link navigates to Settings → Move details
- [ ] Empty state handled when distance is missing