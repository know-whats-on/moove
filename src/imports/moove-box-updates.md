# Lovable Update Prompt: **Moove** — Update Boxes Section with 5 Status Icons + Move Out / Move In Logic

## Goal
Update the **Boxes page + Box Detail** so the box visuals + statuses match the new “Moove” system:

- **Move Out Mode**: user adds boxes and adds items into boxes.
- **Move In Mode**: user marks items “Unpacked” (or marks the whole box “Unpacked”).

The box should be represented by **cartoon icon art** (not real photos). The icon changes automatically based on box state.

---

## 1) Add “Move Mode” toggle (global)
Add a segmented control at the top of the Boxes tab (and persist in Settings as well):

- **Move Out**
- **Move In**

Store as a single app setting:
- `move_mode: "MOVE_OUT" | "MOVE_IN"` (default = MOVE_OUT)

This mode changes what actions are available (add items vs mark unpacked), but the same boxes remain visible.

### Acceptance Criteria
- Mode toggle exists on Boxes page and affects Boxes + Box Detail behavior immediately.
- Default mode is **Move Out**.

---

## 2) Implement 5 derived box statuses + icon mapping
### Status rules (derived, not manually set)
A box has one manual field: `sealed: boolean`.
Everything else is derived automatically.

Add a per-item flag:
- `BoxItem.unpacked: boolean` (default false)

Derive box status as:

### **Move Out Mode**
1) **Empty Box**
- Condition: `sealed = false` AND total items = 0  
- Status label: **Empty**

2) **Packing Box**
- Condition: `sealed = false` AND total items >= 1  
- Status label: **Packing**

3) **Packed Box**
- Condition: `sealed = true`  
- Status label: **Packed**  
- Note: Do not allow sealing an empty box (show a friendly message if attempted).

### **Move In Mode**
4) **Unpacking Box**
- Condition: total items >= 1 AND unpacked items >= 1 AND unpacked items < total items  
- Status label: **Unpacking**
- Behavior: once the first item is marked unpacked, the box is effectively open; set `sealed=false` automatically if it was sealed.

5) **Unpacked Box**
- Condition: total items >= 1 AND unpacked items = total items  
- Status label: **Unpacked**
- UX intent: box is “empty and done” from the user’s perspective. Hide unpacked items by default so it *looks* empty.

> Important: In Move In mode, a box that is still fully packed (0 items marked unpacked) should show **Packed** (icon + label) until unpacking begins.

---

## 3) Use these 5 icon assets by filename (cartoon-only)
Replace all realistic box photos with cartoon icon art. The **box IS the icon**.

Use these exact filenames to render the correct icon:

### Asset filename mapping
- **Empty** → `EmptyBox.png`
- **Packing** → `PackingBox.png`
- **Packed** → `PackedBox.png`
- **Unpacking** → `UnpackingBox.png`  *(create/add this asset in the same style)*
- **Unpacked** → `UnpackedBox.png`

### Where to use icons
- Boxes page grid tiles (primary visual)
- Box Detail header card (same icon, consistent)
- Empty states (small decorative use OK)

### Acceptance Criteria
- No photographic box images appear anywhere in Boxes UI.
- Icons switch automatically and correctly based on derived status.

---

## 4) Boxes page layout updates (status-based + icon grid)
Replace “Open Boxes / Sealed Boxes” sections with status groupings that match the current mode.

### In **Move Out Mode**, show 3 groups:
- **Empty**
- **Packing**
- **Packed**

### In **Move In Mode**, show 3 groups:
- **Packed**
- **Unpacking**
- **Unpacked**

Each group displays a **responsive icon grid**:
- 2 columns on phones, 3 on larger screens
- Each tile shows:
  - The correct status icon (from filenames above)
  - Box label beneath (1–2 lines)
  - Optional small subtext (room)
  - Small badge chip: **Empty / Packing / Packed / Unpacking / Unpacked**

Keep search + room/fragile filters. Status grouping makes it easy to scan.

### Acceptance Criteria
- Boxes are displayed as **icon tiles** (not panel cards).
- Boxes are grouped by the correct statuses depending on mode.

---

## 5) Box Detail behavior (mode-specific controls)
### Box Detail header card
- Show:
  - Box label
  - Current status icon (auto)
  - Current derived status label (auto)

### Move Out Mode controls
- Show:
  - **Add items** section (quick-add + list)
  - A primary action:
    - If Empty or Packing: **Seal Box** (disabled if Empty)
    - If Packed: **Unseal Box** (for corrections)
- Sealing rules:
  - If total items = 0, prevent sealing and show message:
    - “Add at least one item before sealing this box.”

### Move In Mode controls
- Hide/disable adding new items (this mode is for unpacking).
- Show unpacking UI:
  - Each item row has a toggle: **Unpacked**
  - A button: **Mark entire box unpacked**
    - Sets all `BoxItem.unpacked=true`
- Presentation:
  - Show “Remaining in box” list = items where `unpacked=false`
  - Optionally show a collapsed section “Unpacked (done)” = items where `unpacked=true`
  - When all items are unpacked, the remaining list is empty and status becomes **Unpacked** (box feels empty).

### Acceptance Criteria
- In Move Out: user can add items and seal/unseal.
- In Move In: user can mark items unpacked and mark entire box unpacked; adding items is not the primary flow.

---

## 6) Quick-add improvements (Move Out only): Enter to add + name + quantity
Update the quick-add row in Box Detail (Move Out mode only):

- Input 1: **Item name**
- Input 2: **Qty** (number, default 1)
- Add button (+)
- Keyboard behavior:
  - Press **Enter/Done** in either field adds the item
  - After adding: clear item name, reset qty to 1, keep focus in item name

Validation:
- If item name is empty, do not add and show subtle inline hint.
- If qty is invalid, default to 1.

### Acceptance Criteria
- User can add “Charger” qty 2 quickly.
- Pressing Enter adds the item without tapping the + button.

---

## 7) Final Acceptance Checklist
- [ ] Global toggle: Move Out / Move In (persisted).
- [ ] Five derived statuses implemented exactly:
  - Empty, Packing, Packed, Unpacking, Unpacked
- [ ] Icon mapping uses filenames:
  - EmptyBox.png, PackingBox.png, PackedBox.png, UnpackingBox.png, UnpackedBox.png
- [ ] Boxes page uses **icon grid tiles** with labels underneath (no panels, no photos).
- [ ] Move Out: add items + seal/unseal; seal disabled when empty.
- [ ] Move In: mark items unpacked or whole box unpacked; status transitions to Unpacking/Unpacked automatically.
- [ ] Quick-add supports **item name + quantity** and **Enter-to-add**.