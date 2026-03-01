# Lovable Update Prompt: Boxes Page + Box Detail (Moove)

## Goal
Update the **Boxes** page and **Box Detail** experience so it is simpler, more delightful, and aligned with the Moove “cute Highland Cow” cartoon theme. Remove confusing status concepts and make packing state automatic. Improve quick-add item UX.

---

## 1) Simplify “status” to Open vs Sealed only
### What to change
- Remove the current multiple box statuses that appear to duplicate the Open/Sealed concept.
- A box should have only **one manual state** the user controls:
  - **Open**
  - **Sealed**

### Data model update
- Keep: `sealed: boolean`
- Remove box-level `status` from the Boxes UI (do not show or edit it on Boxes page / Box detail).
- Do not add additional manual status fields.

### Acceptance criteria
- The Boxes page shows only **Open Boxes** and **Sealed Boxes** sections.
- Box Detail shows only an **Open / Sealed** toggle.
- No “Unpacked/Packed/Moved” (or similar) appears anywhere on Boxes or Box Detail after this update.

---

## 2) Automatic packing state (derived label)
### What to change
Add a derived, display-only state for Open boxes:
- If `sealed = false` and item count = **0** → show **“Empty”**
- If `sealed = false` and item count **>= 1** → show **“Packing”**
- If `sealed = true` → show **“Sealed”** (always)

### UI placement
- On each box tile (grid), show a small friendly badge near the top-right:
  - Open & 0 items: `Empty`
  - Open & 1+ items: `Packing`
  - Sealed: `Sealed`
- In Box Detail, replace the existing text (“Currently packing…”) with dynamic helper text:
  - Empty: “Empty box. Add your first item.”
  - Packing: “Packing in progress. Keep going!”
  - Sealed: “Sealed and ready to Moove.”

### Acceptance criteria
- Packing/Empty are **automatic** and cannot be manually set.
- Sealed is the only manual state.
- Switching to Sealed does not change item count; it only locks the box state visually (see section 2.1 optional locking).

---

## 2.1 (Optional but recommended) Sealed behavior
### What to change
- When a box is **Sealed**, keep viewing contents allowed, but make adding items slightly more deliberate:
  - Either disable quick-add with a friendly note: “Unseal to add items.”
  - Or allow adding but show a warning toast: “This box is sealed. Unseal to keep packing tidy.”

### Acceptance criteria
- Sealed boxes are clearly “done” visually, and the system gently nudges unsealing before edits.

---

## 3) Make the box icon cartoon-like (no real photo box)
### What to change
- Replace the real box photo/image style with **custom cartoon box icons** consistent with Moove’s Highland Cow theme.
- The **box itself is the icon**: a clean illustrated open box and an illustrated sealed box.
- Do not use realistic stock photos for boxes.

### Visual rules
- Use 2 core illustrations:
  - **Cartoon Open Box** (flaps open)
  - **Cartoon Sealed Box** (tape/seam line, flaps closed)
- The style must match the mascot illustrations: soft, friendly, slightly playful, dark-mode ready.
- Keep the grid layout: box icon on top, label beneath.

### Acceptance criteria
- Boxes grid uses cartoon icons only (no photographic box images).
- Box Detail uses the same cartoon box icon in its header card, switching open/sealed visually.

---

## 4) Quick-add UX: press Enter to add
### What to change
In Box Detail > Contents section:
- The user can type and press **Enter** to add the item (no need to tap +).
- On mobile, ensure “Done/Enter” on the keyboard triggers add.

### Acceptance criteria
- Enter key adds the item.
- After adding, clear inputs and keep focus in the item name field for rapid entry.

---

## 5) Quick-add supports Item Name AND Quantity
### What to change
Replace the single quick-add field with **two inputs**:
- **Item name** (text)
- **Qty** (number, default 1)

### Interaction rules
- Default quantity = 1.
- If the user types a name and presses Enter:
  - Add using current qty value.
- If the user types qty and presses Enter while in qty field:
  - Add item as well.
- Validate:
  - If name is empty → do not add; show tiny inline hint “Add an item name”.
  - If qty is empty/invalid → fallback to 1.

### Display rules
- In the list, show: `Item Name` on left, `x{quantity}` on right.

### Acceptance criteria
- Users can add “Charger” qty 2 in one quick action.
- Pressing Enter in either input adds the item.
- Quantity persists (optional): keep last used quantity OR reset to 1 (choose one; default reset to 1 for simplicity).

---

## UI specifics to update (Boxes page)
- Keep sections:
  - **OPEN BOXES (n)**
  - **SEALED BOXES (n)**
- Each tile shows:
  - Cartoon box icon (open or sealed)
  - Box label under icon
  - Small badge (Empty / Packing / Sealed)
  - Room label as subtle subtext (optional)
  - Fragile indicator (small corner badge) if `fragile=true`

---

## UI specifics to update (Box Detail page)
- Top card shows:
  - Cartoon box icon (open/sealed)
  - Segmented control: **Open | Sealed**
  - Dynamic helper text based on derived state (Empty / Packing / Sealed)
- Remove any dropdowns or controls related to old statuses.
- Contents section:
  - List items
  - Quick-add row: [Item name input] [Qty input] [+ button]
  - Enter adds item

---

## Final acceptance checklist
- [ ] Only Open/Sealed exists as a manual box state.
- [ ] Packing/Empty are auto-derived for Open boxes based on item count.
- [ ] Cartoon box icons replace real box images everywhere in Boxes + Box Detail.
- [ ] Enter key adds items reliably on mobile and desktop.
- [ ] Quick-add supports item name + quantity with sensible defaults and validation.