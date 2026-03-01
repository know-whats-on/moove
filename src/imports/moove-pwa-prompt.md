# Lovable Build Prompt: **Moove** (PWA) — Highland Cow Theme + “Ask Moove” AI Agent (Default Dark Mode)

## 1) App name + one-sentence value proposition
**App name:** **Moove**  
**Value proposition:** A mobile-first PWA that makes moving out calmer by tracking real moving boxes (and what’s inside them), managing a categorized address-change checklist, and letting you ask “Where is ___?” anytime.

---

## 2) Primary user flows (must support)
- **Create boxes**
  - Add a box with label, size, room, status, fragile toggle, optional photo, optional notes.
  - New boxes appear with a delightful **drop-in** animation + **cute confetti** burst.
- **Pack items into boxes**
  - Open a box, add items (name, quantity, optional category, optional notes), edit/remove items.
- **Seal / unseal boxes (open/close)**
  - Toggle a box between **Open** (not sealed) and **Closed** (sealed).
  - Clear visual difference between open vs closed boxes everywhere the box appears.
- **Track packing status**
  - Update status (Unpacked → Packing → Packed → Moved), search and filter to find boxes fast.
  - See totals (boxes packed, items packed).
- **Complete address changes**
  - View a prefilled categorized list, edit items, add custom items, mark Done.
- **Ask the AI agent about your stuff**
  - Ask: “Where is _____?” or “List everything in Box ____” and get answers based ONLY on saved boxes/items.

---

## 3) Pages + navigation (bottom nav) + AI entry point
Build a **mobile-first PWA** with persistent **bottom navigation** and **default dark mode**.

### Tabs (bottom nav)
1. **Dashboard**
2. **Boxes**
3. **Address Changes**
4. **Move-out Checklist**
5. **Settings**

### Global AI entry point (required)
Add a persistent entry point on every tab:
- A small top-right button or floating pill: **“Ask”** (opens **Ask Moove**).
- Opens a **bottom-sheet chat** with:
  - Input placeholder: “Ask about boxes or checklists…”
  - Suggested chips:
    - “Where is my ___?”
    - “List items in Box ___”
    - “Show open boxes”
    - “Show closed boxes”
    - “What’s still unpacked?”

---

## 4) THEME REQUIREMENT (apply across the entire app)
### A) Brand + mascot
- Entire app uses a **cute Highland Cow** theme.
- Create a consistent AI-generated mascot: **a cute Highland Cow** with shaggy auburn hair, small horns, warm friendly eyes, and a subtle moving-day vibe (tiny sticker/scarf).
- Mascot name in UI copy: **Moo** (recommended).
- Use Moo in:
  - Dashboard hero banner
  - Section banners (Boxes / Address Changes / Checklist)
  - Empty states
  - AI bottom-sheet header

### B) Illustration style (consistent)
- Use one consistent illustration style across all banners/empty states:
  - Soft, modern, cute (clay/soft-3D or clean vector with gentle shading).
  - No generic icon packs.
  - No mismatched styles.
- Must look premium in **dark mode**.

### C) Dark mode defaults
- **Default theme = Dark Mode ON**
- Visual tone: warm, cozy, “moving day comfort”
  - Backgrounds: deep charcoal/near-black with subtle warm undertones
  - Cards/surfaces: slightly lighter charcoal with soft borders
  - Accents: warm amber/caramel + muted greens (accessible)
- All text must be readable with accessible contrast (avoid gray-on-gray).

---

## 5) Dashboard (requirements)
- **Hero banner** at top includes Moo and friendly copy:
  - Title: “Moove”
  - Subtitle: “Your calm cow-panionship for moving day. Track boxes, update addresses, and check off tasks.”
- **Progress cards (4):**
  1) Boxes: total, packed, moved  
  2) Items: total items, items in Packed/Moved boxes  
  3) Address Changes: total, done  
  4) Checklist: total, done
- **Next up** list (max 5): prioritized items from:
  - Boxes with status Unpacked/Packing
  - AddressChangeItems status To do
  - Checklist tasks (if due dates exist, prioritize earliest)
- **Quick actions**: Add Box, Add Address Change Item, Add Checklist Task
- Add a small card: **“Ask Moove”** → opens AI bottom-sheet (with Moo’s face).

---

## 6) Boxes (MUST be “boxes themselves”, not panels)
### Core requirement (important)
The **Boxes page must display boxes as visual box objects** (like the provided references), with the **box name/label underneath**, not as rectangular card panels.

### Boxes page layout (still feels like a packing station)
- The overall Boxes page background feels like a box/packing station:
  - Subtle cardboard texture/pattern (dark-mode friendly)
  - Header area styled like a shipping box flap edge (premium, not gimmicky)
  - Light cow-themed touches (tiny Moo sticker on header, subtle hoof-print pattern at low opacity)

### Open/Closed box visuals (reference behavior)
- Use **two distinct custom illustrations** for boxes (original artwork, not stock):
  1) **Open Box**: top flaps open (like the open-box reference)
  2) **Closed Box**: flaps closed and sealed (like the closed-box reference)
- These visuals are the primary representation of a box throughout the Boxes page:
  - Open Boxes section uses the open-box illustration.
  - Closed Boxes section uses the closed-box illustration (with a subtle tape/seam line).

### Boxes page UI
- Title: “Boxes”
- **Search**: “Search boxes or items…”
- **Filter chips**: Room, Status, Fragile
- **Summary strip**: “Packed: X/Y boxes • Items packed: A/B”
- **Two required sections:**
  1) **Open Boxes** (sealed=false)
  2) **Closed Boxes** (sealed=true)

### Boxes section display (grid of box objects)
For each section (Open Boxes / Closed Boxes):
- Display boxes in a **responsive grid** (mobile-first):
  - 2 columns on phone, 3 on larger screens if space allows
- Each grid item is a **Box Tile**:
  - **Top:** the box illustration (open or closed depending on sealed state)
  - **Below:** the box label/name (1–2 lines, ellipsis if long)
  - **Optional tiny meta row (below label, very subtle):** room • status
  - **Small badges as overlays (minimal, not cluttered):**
    - Fragile (small corner badge)
    - Status dot/pill (very compact)
- Tap a box tile → opens **Box Detail**.
- Long-press or overflow menu (⋯) on the tile → quick actions: Edit, Delete, **Seal/Unseal**.

### New box animation (drop + confetti)
- When a new box is created:
  - The new **box tile drops in from above** with a soft bounce into the grid.
  - A small, tasteful **confetti burst** appears near the tile (brief).
  - Accessibility: if “prefers reduced motion”, use gentle fade-in (no bounce/confetti).
- Confetti must be visible in dark mode and not harm readability.

### Box Detail
- Header: Back, Box label, Edit
- Box fields:
  - size, room, status (editable), fragile, optional photo, notes
  - **Seal toggle (REQUIRED):**
    - Switch or segmented control: **Open / Closed**
    - Helper copy:
      - Open: “Not sealed”
      - Closed: “Sealed”
    - Show the corresponding box illustration state (open flaps vs sealed box)
- Items list + add/edit/delete items
- Confirm before deleting a box (warn items will be deleted too)

---

## 7) Address Changes (requirements)
- Prefilled categories (accordion or grouped cards) with To do/Done counts:
  - Bank/Finance
  - Employer/Payroll
  - Government IDs
  - Utilities
  - Insurance
  - Healthcare
  - Education
  - Subscriptions/Streaming
  - Delivery/Shopping
  - Friends/Family
  - Vehicle/Registration
  - Voting
  - Pets
- Each item supports: edit/delete, notes, optional due date, optional link, status toggle (To do/Done).
- Add custom items + custom categories (typed).
- Overall completion count + per-category counts.
- Section banner includes Moo with an “address stamp” vibe (consistent style).

---

## 8) Move-out Checklist (lightweight)
- Minimal timeline/list with prefilled tasks (editable):
  - Notice to landlord
  - Cleaning
  - Condition report
  - Bond
  - Utilities transfer
  - Key return
  - Mail redirect
- Each task: status toggle (To do/Done), optional notes
- Add custom tasks
- Keep minimal: no calendars, no notifications.

---

## 9) Settings
- **Theme:** Default is **Dark Mode ON**. Include a toggle to switch Light/Dark (optional, but default must be Dark).
- Data: Export (CSV) for Boxes + Address Changes, Reset data (confirm)
- PWA install help (static copy)
- AI: “Enable Ask Moove AI” toggle (default ON) + privacy note (AI uses only your saved data).

---

## 10) Data model (required + optional fields)
Implement these models. Add ONLY what’s necessary for the requested features.

### Box
- **id** (string/uuid) — required
- **label** (string) — required
- **size** (enum: S, M, L) — required
- **room** (string) — required
- **status** (enum: Unpacked, Packing, Packed, Moved) — required
- **fragile** (boolean) — required
- **photo** (string/url) — optional
- **notes** (string) — optional
- **sealed** (boolean) — required  
  - sealed=false → Open Boxes section + open-box visual  
  - sealed=true → Closed Boxes section + closed-box visual

### BoxItem
- **id** (string/uuid) — required
- **box_id** (string/uuid) — required
- **name** (string) — required
- **quantity** (number/int) — required
- **category** (string) — optional
- **notes** (string) — optional

### AddressChangeItem
- **id** (string/uuid) — required
- **category** (string) — required
- **place/organization** (string) — required
- **action** (string) — required
- **due_date** (date/string) — optional
- **status** (enum: To do, Done) — required
- **notes** (string) — optional
- **link** (string/url) — optional

### ChecklistTask
- **id** (string/uuid) — required
- **title** (string) — required
- **status** (enum: To do, Done) — required
- **notes** (string) — optional
- **group** (string) — optional

### AiChatMessage (optional, for UX)
- **id** (string/uuid) — required
- **role** (enum: user, assistant) — required
- **content** (string) — required
- **created_at** (date/time) — required

---

## 11) Feature requirements (must implement)
### A) Boxes
- Boxes page visually styled like a packing station.
- **Boxes are displayed as box objects in a grid** with **label underneath** (no panel-style cards).
- **Open vs Closed is REQUIRED**
  - Two sections: Open Boxes and Closed Boxes
  - Clear open/closed visuals (open flaps vs sealed closed box)
  - One-tap Seal/Unseal control
- CRUD boxes + CRUD items
- Search across box labels + item names
- Filters: room, status, fragile
- Totals: boxes packed (status Packed), boxes moved (Moved), items packed (items inside Packed/Moved boxes), total items
- Fast UX: quick-add item (name + quantity default 1), one-tap status change
- **New box animation**: drop-in + confetti (respects reduced motion)

### B) Address Changes
- Prefilled categories exactly as listed
- Items editable + custom items/categories
- Status toggle (To do/Done) + completion counts

### C) Move-out Checklist
- Prefilled tasks exactly as listed
- Mark Done + add custom tasks
- Minimal timeline/list only

### D) Ask Moove (AI Agent) — REQUIRED
**Goal:** Answer queries using ONLY app data (no hallucinations).

#### AI UI
- Bottom-sheet chat from global **Ask**
- Header includes Moo and title **“Ask Moove”**
- Suggestion chips
- Responses include action buttons (Open Box, View Matches)

#### Required queries
1) **“Where is ____?” (Item Locator)**
   - Search BoxItems `name` for partial match
   - Return grouped by Box label with metadata (room, status, fragile, sealed/open)
   - Include **Open Box** deep link button
   - If none found: clear “not found” response + suggestion to add item

2) **“List everything in Box ____” (Box Inventory)**
   - Match box by label (exact then partial)
   - Return list: item name — quantity (category if present)
   - Include box metadata (room, status, sealed/open) + **Open Box** button
   - If multiple matches: show selectable options

#### Optional helpful queries (answers only, no new features)
- “Show open boxes” → boxes where sealed=false
- “Show closed boxes” → boxes where sealed=true
- “What’s still unpacked?” → boxes status Unpacked/Packing
- “Show fragile boxes” → boxes fragile=true
- “What address changes are left?” → AddressChangeItems status To do grouped by category

#### Implementation approach (required)
- Implement tool-like functions that query local database:
  - `findItem(queryText)`
  - `listBoxContents(boxLabelOrId)`
  - `listBoxesByFilter(room?, status?, fragile?, sealed?)`
  - `listRemainingAddressChanges()`
- Responses must reference returned IDs for deep links
- AI must not invent items/boxes

---

## 12) Required microcopy (legible in Dark Mode)
- Boxes empty:
  - Title: “No boxes yet”
  - Body: “Add your first box and start packing with less chaos.”
  - CTA: “Add a box”
- Open Boxes empty:
  - Title: “No open boxes”
  - Body: “Open boxes are unsealed. Add one when you’re still packing.”
- Closed Boxes empty:
  - Title: “No closed boxes”
  - Body: “Closed boxes are sealed and ready to move.”
- Box items empty:
  - Title: “This box is empty”
  - Body: “Add items so you can find them instantly later.”
  - CTA: “Add item”
- Address Changes empty:
  - Title: “Nothing here yet”
  - Body: “Add an address change item to track it.”
  - CTA: “Add address change”
- Checklist empty:
  - Title: “Checklist is clear”
  - Body: “Add a task so move-out day doesn’t surprise you.”
  - CTA: “Add task”
- AI empty state:
  - Title: “Ask Moove”
  - Body: “Try: ‘Where is my kettle?’ or ‘List everything in Box Bedroom 2’”
  - Chips: “Where is my ___?”, “List items in Box ___”, “Show open boxes”, “Show closed boxes”
- AI not-found response:
  - “I couldn’t find that in your boxes yet. Add it to a box or try a different name.”

---

## 13) Non-goals (do NOT build)
- No payments
- No marketplace
- No person-to-person chat
- No sharing/collaboration
- No AI beyond answering from existing data
- No internet browsing for answers
- No extra modules beyond specified features

---

## 14) Acceptance criteria (Lovable must meet these)
- PWA + mobile-first layout with persistent bottom nav (5 tabs).
- **Default Dark Mode ON** and visually polished; all text readable with accessible contrast.
- **Highland Cow theme across entire app**:
  - Custom AI-generated Highland Cow mascot (Moo)
  - Consistent illustration style used in hero/section banners/empty states/AI header
  - No generic icon packs as primary visuals
- Boxes:
  - **Boxes displayed as box objects in a grid** with **label underneath** (not panels/cards)
  - **Open vs Closed implemented** via `sealed` boolean
  - Two sections: Open Boxes and Closed Boxes with clear open/closed visuals
  - **New box drop-in + confetti** animation (respects reduced motion)
  - CRUD boxes + CRUD items
  - Search across boxes + items
  - Filters: room, status, fragile
  - Totals shown (boxes packed, items packed)
- Address Changes:
  - Prefilled categories exactly as listed
  - Items editable + custom categories/items supported
  - Status toggle (To do/Done) + completion counts
- Move-out Checklist:
  - Prefilled tasks exactly as listed
  - Mark Done + add custom tasks
  - Lightweight timeline/list only
- Ask Moove AI Agent:
  - Available globally from every page
  - Supports “Where is ____?” and “List everything in Box ____”
  - Can answer “Show open boxes / closed boxes”
  - No hallucinations: answers must come from database query results
  - Handles ambiguity via selectable options
- Non-goals respected: no payments/marketplace/unrelated features