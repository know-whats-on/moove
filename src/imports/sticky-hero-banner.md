# Lovable Update Prompt: Moove — Make Hero Banner Headers “Sticky” (Freeze in Place, Scroll Content Only)

## Goal
Make each page’s **hero banner header** behave like a nav bar: it stays **frozen at the top** while the **page content scrolls underneath**. Only the content area should be scrollable.

Apply to: **Home, Boxes, Address, Checklist, Settings**.

---

## 1) Make the header area sticky/fixed per page
### Requirements
- Convert the hero banner + its immediate controls into a **sticky header** region.
- The sticky region should include:
  - The hero banner (title/subtitle + cow image)
  - Any page-level controls directly tied to that section:
    - Boxes: Move Out / Move In toggle + search row (+ add button)
    - Address: overall progress bar can stay in content (optional), but header stays sticky
    - Home: hero greeting stays sticky; cards below scroll
    - Settings: banner stays sticky; form content scrolls
    - Checklist: banner stays sticky

### Behavior
- Sticky header remains visible at the top while scrolling.
- Content scrolls beneath it.
- Sticky header should have a subtle bottom divider/shadow so it feels layered.

### Acceptance criteria
- When user scrolls down, the banner header does not move.
- Only the list/cards content moves.

---

## 2) Handle safe areas + bottom nav correctly
### Requirements
- Sticky header must respect top safe area (notch).
- Content area must have:
  - Top padding equal to sticky header height (so content doesn’t hide under it)
  - Bottom padding for bottom nav + safe area

### Acceptance criteria
- No content is hidden behind the sticky header or behind bottom nav.

---

## 3) Responsive header height and optional “compact” mode
### Requirements
- On small phones, the full banner can take too much space. Add an automatic compact behavior:
  - When user scrolls beyond a small threshold, the header **compresses** slightly:
    - Reduce banner height
    - Shrink mascot image slightly
    - Keep title visible (and subtitle can fade/shorten)
- Respect reduced motion: use a simple fade/size change, not bouncy animations.

### Acceptance criteria
- Sticky header doesn’t consume excessive vertical space while reading long lists.
- Title remains visible at all times.

---

## 4) Keep banner image anchoring intact
### Requirements
- Even when sticky/compact:
  - Mascot image remains **bottom-right anchored** and bottom-flush inside the header banner (same as current spec).
- Do not reintroduce the “image drifting left” issue:
  - Ensure the sticky header still uses the same absolute positioning rules.

### Acceptance criteria
- Cow images stay bottom-right aligned in sticky state and compact state.

---

## 5) Implementation guidance (scroll container model)
### Requirements
- Structure each page with:
  - A fixed/sticky header container
  - A separate scrollable content container beneath
- Prefer `position: sticky; top: 0;` for the header within the page layout.
- Use `overflow-y: auto` on the content container, not on the whole page body.

### Acceptance criteria
- Scroll feels smooth and native on mobile.
- Header never jitters or scrolls away.

---

## Final checklist
- [ ] Home/Boxes/Address/Checklist/Settings hero banners are sticky
- [ ] Only the content area scrolls
- [ ] Safe areas and bottom nav padding handled properly
- [ ] Optional compact sticky header on scroll for small screens
- [ ] Mascot images remain bottom-right anchored and flush