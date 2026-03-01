# Lovable Update Prompt: Moove — Add Hero Banners for **Settings** (CowSettings.png) and **Home** (CowHome.png)

## Goal
Bring **Settings** and **Home** pages into the same visual system as **Address / Boxes / Checklist**:
- Add a consistent **hero banner header** at the top of each page.
- Use the provided mascot banner PNGs:
  - Settings → **CowSettings.png**
  - Home → **CowHome.png**
- The mascot image must be **bottom-right anchored** and the **bottom edge must be flush** with the banner section edge (no gap).
- Keep everything **fully responsive** and premium in **default dark mode**.

---

# A) SETTINGS PAGE — Hero Banner with **CowSettings.png**

## 1) Add hero banner to Settings (same layout system)
### Requirements
- Add a top hero banner section that matches Address/Boxes/Checklist:
  - Large title
  - Short subtitle
  - Mascot illustration on right
  - Subtle gradient overlay (darker left behind text → lighter right near cow)

### Banner copy (use exactly)
- Title: **Settings**
- Subtitle: **“Tweak your Moove. Replay the tour anytime.”**

### Acceptance criteria
- Settings page has a hero banner visually consistent with other sections.

## 2) Use CowSettings.png (right side, bottom-flush)
### Requirements
- Use **CowSettings.png** as the banner illustration.
- Positioning:
  - Anchor to **bottom-right**
  - The **bottom edge of the PNG touches the bottom edge of the banner** (flush, no padding gap).
- Size:
  - Hero-sized (~40–60% of banner height).
  - Allow tasteful right-edge cropping if needed to preserve text readability.
- No circular avatar frames; use the raw illustration.

### Acceptance criteria
- CowSettings.png is clearly visible, grounded to the bottom edge, and doesn’t collide with title/subtitle.

## 3) Settings content stays intact
### Requirements
- Do not change functionality.
- Keep/ensure the existing **How to Moove** button remains visible in Settings content below the banner.

### Acceptance criteria
- All existing Settings controls remain functional and in place.

---

# B) HOME PAGE — Hero Banner with **CowHome.png**

## 1) Replace/upgrade Home hero banner to match system
### Requirements
- Home already has a hero section; update it so it matches the banner pattern used elsewhere:
  - Left: greeting text
  - Right: mascot image
  - Gradient overlay for contrast

### Greeting rules (keep exactly)
- Line 1: **Let’s Moove,**
- Line 2: **<Name>**

## 2) Use CowHome.png (bigger, close-up feel, bottom-right flush)
### Requirements
- Replace the current Home banner image with **CowHome.png**.
- Make it **big and zoomed-in** (hero emphasis):
  - Use cover-like cropping if necessary to create a close-up effect.
- Positioning:
  - Anchor to **bottom-right**
  - The **bottom edge of CowHome.png touches the bottom edge of the banner** (flush, no gap).
- Ensure the cow does not overlap the greeting text:
  - Add a left-to-right gradient overlay behind text.

### Acceptance criteria
- CowHome.png is visually dominant, close-up, and bottom-right/bottom-flush.
- Greeting text remains readable at all screen sizes.

## 3) Home content stays intact
### Requirements
- Do not change the Home features (Days Until Moove card, distance summary card, quick actions, etc.).
- This is purely the banner/header update.

### Acceptance criteria
- Home interactions remain unchanged; only banner visuals are updated.

---

# Shared Implementation Notes (applies to both pages)

## Bottom-flush behavior (non-negotiable)
- The mascot image should be positioned using an absolute-positioned element inside a relative banner container:
  - Anchor: `bottom: 0; right: 0;`
- Ensure **no extra padding** pushes the image up from the bottom edge.

## Responsive rules
- Small phones:
  - Keep text readable; crop the mascot more rather than shrinking text.
  - Maintain bottom-flush anchoring.
- Tablets/desktop:
  - Use a max-width container for content.
  - Avoid stretching or pixelation (no distortion).

## Dark mode readability
- Always use a subtle gradient overlay to protect text contrast:
  - Darker on the left behind text
  - Fades toward the right near the mascot

---

# Final checklist
- [ ] Settings has a hero banner with **CowSettings.png**, bottom-right anchored, bottom edge flush
- [ ] Home hero uses **CowHome.png**, big/close-up, bottom-right anchored, bottom edge flush
- [ ] Text remains readable via gradient overlay
- [ ] Fully responsive across screen sizes
- [ ] No functional regressions on Home or Settings