# Lovable Update Prompt: Moove — Upgrade “Ask Moove” into a Smart Finder (Autocomplete + Structured Commands, Not a Generic Chatbot)

## Goal
Transform **Ask Moove** from a generic chat into a **smart, command-first finder** with:
- Instant **autocomplete suggestions** while typing
- Intent detection for the two primary commands:
  1) **“Where is my ____?”** → autocomplete from **Items**
  2) **“List everything in ____.”** → autocomplete from **Box names**
- Tap-to-fill suggestions and one-tap execute
- Results shown as structured cards with deep links (not chatty paragraphs)

This must be fast, phone-first, and grounded only in app data (no hallucinations).

---

## 1) Replace “chat” input with a Smart Command Bar
### UI requirements
- Keep Ask Moove as a bottom sheet, but redesign the top area:
  - Title: **Ask Moove**
  - Subtitle (small): “Find items, boxes, and what’s inside.”
- Primary input becomes a **Smart Command Bar** with:
  - Placeholder: `Try “Where is my charger?” or “List everything in Box 2.”`
  - Right side action: **Go**
- Below the input: **live suggestion dropdown** (like search suggestions).

### Acceptance criteria
- The experience feels like a finder/search tool, not a chatbot.

---

## 2) Intent detection (real-time as user types)
Detect intent as the user types and switch suggestion source accordingly.

### Intent A: Item locator
Trigger when input starts with any of:
- `where is`
- `where’s`
- `where is my`
- `wheres my`
- `find my`
- `find`
- or contains `where` + `my`

**Suggestion source:** `BoxItem.name`

### Intent B: Box inventory
Trigger when input starts with any of:
- `list everything in`
- `list everything from`
- `list items in`
- `what’s in`
- `whats in`
- `show me what’s in`

**Suggestion source:** `Box.label`

### Fallback: general search
If neither intent is detected:
- Show two suggestion groups:
  - “Items” (top matches)
  - “Boxes” (top matches)

### Acceptance criteria
- Typing “Where is my…” immediately shows item suggestions.
- Typing “List everything in…” immediately shows box suggestions.

---

## 3) Autocomplete behavior (the “smart” part)
### For “Where is my ____?”
As soon as the user types after “my”, show a dropdown list of item matches:
- Each suggestion row shows:
  - Item name (bold)
  - Small subtext: `in {Box Label}` (if unique) or `in {N} boxes`
- Tapping a suggestion:
  - Auto-fills the item name into the command:
    - `Where is my Charger?`
  - Immediately shows a “Press Go” hint or auto-run (choose auto-run for delight)

### For “List everything in ____.”
Show a dropdown list of box label matches:
- Each suggestion row shows:
  - Box label (bold)
  - Subtext: `{room} • {derived status}` (Empty/Packing/Packed/Unpacking/Unpacked)
- Tapping a suggestion fills:
  - `List everything in Box 2.`

### Keyboard support
- Arrow keys (desktop) optional
- Enter key:
  - If a suggestion is highlighted, Enter selects it
  - Otherwise Enter executes the current command

### Acceptance criteria
- Suggestions appear within 150–250ms and feel instant.
- Tapping a suggestion fills the correct part of the sentence.

---

## 4) Query execution and results (structured cards, not chat)
### Result format: Item locator (“Where is my X?”)
Return results as **cards**, grouped by box:
- Header: `Found in {N} box(es)`
- For each box:
  - Box label + room
  - Derived box status (Empty/Packing/Packed/Unpacking/Unpacked)
  - Matching item(s) + quantity
  - Primary CTA: **Open Box**
- If multiple items closely match, show:
  - “Did you mean…” chips (no open-ended questions)

### Result format: Box inventory (“List everything in Box Y.”)
Return:
- Box header card:
  - Box label + room + derived status
  - CTA: **Open Box**
- Contents list:
  - `Item name — x{qty}`
  - (In Move In mode, show unpacked state badges if relevant)

### Not found behavior
- If item not found:
  - “I can’t find that item in your boxes yet.”
  - Suggestion chips: “Search items”, “Add it to a box”
- If box not found:
  - “I can’t find a box with that name.”
  - Show top 3 closest box name matches as chips

### Acceptance criteria
- Output is concise, structured, and action-oriented.
- No long chatbot paragraphs.

---

## 5) Data + indexing requirements (fast suggestions)
### Required data support
- Maintain a lightweight in-memory index (or cached query) of:
  - Unique item names (and counts)
  - Box labels
- Suggestions should use:
  - case-insensitive contains match
  - plus starts-with boosting for ranking

### Ranking rules
- Starts-with > contains
- Exact match at top
- For items: prefer items that appear in fewer boxes (more specific) and/or recently used boxes (optional)

### Acceptance criteria
- Suggestions are stable and relevant.
- No lag on typical MVP dataset sizes.

---

## 6) UI details to make it feel “smart”
### Add quick command chips above input (always visible)
- `Where is my ___?`
- `List everything in ___`
- `Show open boxes`
- `Show packed boxes`

Tapping a chip pre-fills the command template and moves cursor to the blank.

### Add a small “mode hint” under suggestions
- When in item-locator mode: “Searching items”
- When in box-inventory mode: “Searching boxes”

### Acceptance criteria
- Users understand what the assistant is doing without explanation.

---

## 7) Keep safety rule: no hallucinations
- All answers must come from querying Boxes + BoxItems only.
- If ambiguous, show selectable options.

### Acceptance criteria
- No invented items/boxes ever appear.

---

## Final checklist
- [ ] Ask Moove behaves like a **smart finder**, not a generic chat
- [ ] “Where is my…” autocompletes from **Items**
- [ ] “List everything in…” autocompletes from **Box names**
- [ ] Suggestions are tappable, fill the sentence, and Enter executes
- [ ] Results are structured cards with deep links (Open Box)
- [ ] Fast, responsive, no hallucinations