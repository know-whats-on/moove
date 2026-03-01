# Lovable Update Prompt: **Moove** — Make Entire App Dynamically Screen-Responsive (Phone-First PWA)

## Goal
Ensure Moove is **fully functional as a phone app** and **dynamically responsive** across screen sizes (small phones → large phones → tablets → desktop). Everything must reflow gracefully without clipping, overlapping, or fixed-size assumptions.

This is not just “mobile-friendly”; it must be **screen-responsive everywhere**, including onboarding spotlights, icon grids, bottom sheets, and forms.

---

## 1) Global responsive principles (apply everywhere)
### Layout rules
- Use a fluid layout with:
  - `max-width` containers for large screens (centered content)
  - full-bleed sections where appropriate (hero banners)
  - responsive padding: tighter on small phones, wider on tablets
- All spacing must scale with breakpoints (e.g., xs/sm/md/lg).

### Typography rules
- Use responsive type scale:
  - Headings clamp between small and large sizes (no gigantic text on desktop, no tiny text on phone)
- Ensure line length is readable on large screens (avoid full-width paragraphs).

### Touch + accessibility
- Tap targets: minimum 44px.
- Bottom nav must never overlap content; content areas must have bottom padding accounting for nav height.

### Reduced motion support
- If “prefers reduced motion” is enabled:
  - Replace drop/confetti animations with a fade-in.
  - Onboarding transitions fade only.

### Acceptance criteria
- No horizontal scrolling on any supported device size.
- No clipped UI, overlapping text, or hidden buttons at any breakpoint.

---

## 2) Responsive behavior by component

### A) Bottom navigation
- Must be fixed at bottom on phone.
- On larger screens (tablet/desktop), it can remain bottom-fixed, but content must center with max width.
- Always reserve safe-area padding for devices with notches/home indicators.

**Acceptance criteria**
- Bottom nav never covers the last list item or input field.
- Safe areas respected.

---

### B) Home (hero banner + cards)
- Hero banner must adapt:
  - On small phones: mascot image (HomeCow.png) scales down and/or shifts below text.
  - On medium phones: side-by-side text left, mascot right.
  - On large screens: keep within a max width and avoid stretching the mascot.

- Progress cards:
  - 1 column on small phones when space is tight
  - 2 columns on most phones
  - Up to 4 in a row on tablets/desktops (within max width)

**Acceptance criteria**
- Hero text never overlaps mascot.
- Cards never overflow; they reflow cleanly.

---

### C) Boxes page (icon grid)
- Box tiles must be responsive:
  - Very small phones: 2 columns with smaller icons
  - Typical phones: 2 columns with comfortable spacing
  - Tablets: 3–4 columns
  - Desktop: 4–6 columns within max width
- Group headings (Empty/Packing/Packed etc.) must remain visible and not stick awkwardly.

**Acceptance criteria**
- Box icons + labels never clip.
- Labels wrap to 2 lines max, then ellipsis.
- Tile hit areas remain finger-friendly.

---

### D) Box Detail (forms + quick-add row)
- Quick-add row (Item name + Qty + Add):
  - On small phones: stack into 2 rows if needed:
    - Row 1: Item name (full width)
    - Row 2: Qty + Add button
  - On typical phones: one row is fine.
- Item list must scroll naturally with keyboard open; inputs must remain visible.

**Acceptance criteria**
- Keyboard never blocks the quick-add controls.
- Enter/Done adds the item reliably on mobile.

---

### E) Address Changes + Checklist lists
- Lists must:
  - Use responsive card widths
  - Keep action buttons reachable
- Category accordions must not overflow; long category titles wrap gracefully.

**Acceptance criteria**
- No clipped rows or truncated controls.
- Lists remain usable on small phones.

---

### F) AI bottom-sheet chat (“Ask Moove”)
- Bottom sheet must be responsive:
  - Small phones: nearly full height with safe-area padding
  - Larger phones/tablets: max height with comfortable margins
- Input area must remain visible above keyboard.
- Chat bubbles should have max widths for readability on large screens.

**Acceptance criteria**
- Chat input never disappears behind keyboard.
- Bottom sheet does not exceed viewport height.

---

### G) Onboarding spotlight (How to Moove)
- Spotlight overlay must be **viewport-aware**:
  - If the highlighted element is off-screen, scroll to it smoothly before showing the spotlight.
  - Tooltip card must reposition automatically:
    - Above highlight if near bottom
    - Below highlight if near top
    - Left/right as needed on tablets
  - Tooltip must never render off-screen.

**Acceptance criteria**
- Onboarding works on small phones without clipped tooltip buttons.
- Back/Next/Skip always visible and tappable.

---

## 3) Dynamic breakpoints + safe area handling
Implement responsive breakpoints (example targets):
- XS: 320–360px width phones
- SM: 375–430px phones
- MD: 768px tablets
- LG: 1024px+ desktop

Add safe-area padding:
- top safe area for headers
- bottom safe area for nav + bottom sheets

**Acceptance criteria**
- Works cleanly on iPhone SE-sized screens and larger.
- Works cleanly on tall screens (e.g., 20:9 Android) and iPhones with notch.
- Works on tablets without awkward stretched full-width text.

---

## 4) Testing checklist (must pass)
- [ ] iPhone SE / small phone: no overlap, no clipped text, onboarding fits
- [ ] iPhone 13/14/15: optimal layout, hero and cards balanced
- [ ] Large Android phone: bottom sheets and lists scale correctly
- [ ] iPad/tablet: grids expand, content centered, text readable
- [ ] Desktop: max-width applied, no ultra-wide stretching, nav OK
- [ ] Keyboard open: inputs remain visible (Box Detail quick-add, AI chat)
- [ ] Reduced motion: animations replaced with subtle fades

---

## Final acceptance criteria
- The entire app is **dynamically responsive** and feels like a **real phone app** in a PWA wrapper.
- No fixed pixel assumptions cause broken layouts.
- All key flows (Home, Boxes, Box Detail, Address Changes, Checklist, Ask Moove, Onboarding) remain fully usable at all screen sizes.