# Lovable Update Prompt: Moove — Boxes Search Must Search **Boxes + Items** (Unified Results)

## Goal
Upgrade the Boxes search so it searches:
1) **Box labels** (box names), AND  
2) **Items inside boxes** (BoxItem names)

Search results must include matches from both sources and make it easy to jump to the right box.

---

## 1) Search behavior (single search field)
### Requirements
- Keep the existing search input on the Boxes page.
- As the user types, search should match (case-insensitive, partial match):
  - `Box.label`
  - `BoxItem.name` (and optionally BoxItem.category if present)
- Search should be fast and feel instant (debounce ~150–250ms).

### Acceptance criteria
- Typing “charger” returns boxes containing a “charger” item even if the box label doesn’t include “charger”.
- Typing “kitchen” returns boxes with label “Kitchen” and also boxes that contain items with “kitchen” in the item name/category (if supported).

---

## 2) How results are displayed (clear, box-first UX)
### Requirements
Search results should still respect the current Move Mode grouping (Empty/Packing/Packed etc.), but only show groups that contain matches.

When a match comes from items, it should be obvious why:
- Show the box tile (normal box icon + label)
- Add a small “Matched items” preview beneath the label:
  - Example: `Matches: Charger, Phone cable`
  - Show up to 2–3 item matches, then “+N more”

### Clicking results
- Tapping a result always opens the **Box Detail** screen.
- If the match was from an item, auto-scroll/highlight that item in the Box Detail list (optional but ideal).

### Acceptance criteria
- Users can immediately see whether the match is from the box name or an item inside.
- Tapping always navigates to the correct box.

---

## 3) Search result ranking (simple and intuitive)
### Requirements
Rank results in this order:
1) Box label exact/starts-with matches
2) Item name exact/starts-with matches
3) Box label contains matches
4) Item name contains matches

Within the same rank:
- Prefer boxes with more matched items
- Then prefer recently updated boxes (if available), otherwise stable ordering

### Acceptance criteria
- Searching “Box 3” shows Box 3 at the top.
- Searching “charger” prioritizes boxes where “charger” is a strong match.

---

## 4) Empty-state + reset behavior
### Requirements
- If no results:
  - Show friendly empty state: “No matches. Try a different word.”
- Provide a clear (×) button in the search field to reset search.
- When search is cleared, return to normal grouped view.

### Acceptance criteria
- No-result state is clear and not confusing.
- Clearing search restores the default Boxes page layout.

---

## 5) Implementation notes (data query)
### Requirements
- Implement a unified search query that joins Box ↔ BoxItem:
  - Find boxes where `label ILIKE %q%`
  - OR boxes where any BoxItem `name ILIKE %q%`
- Return a de-duplicated list of matching boxes.
- Also return per box the list of matched item names (for preview in results UI).

### Acceptance criteria
- Boxes matched by multiple items appear once, with a list of matched item previews.
- Performance remains smooth for typical MVP volumes.

---

## Final checklist
- [ ] One search input searches Box labels + BoxItem names
- [ ] Results show box tiles, with “Matched items” preview when relevant
- [ ] Ranking feels intuitive (box name matches first, then item matches)
- [ ] No-result state + clear search (×) works
- [ ] Tap result opens the correct Box Detail (highlight matched item if possible)