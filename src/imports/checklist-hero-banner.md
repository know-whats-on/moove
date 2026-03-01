# Lovable Update Prompt: Moove — Checklist Page Gets Hero Banner + Use CowKeys.png (Match Address/Boxes Style)

## Goal
Update the **Checklist** page to match the **Address Changes** and **Boxes** pages:
- Add the same **hero banner heading** at the top.
- Use the provided banner art **CowKeys.png** on the right.
- Ensure the cow image is **bottom-right anchored** and **bottom edge flush** with the banner section edge.
- Keep everything responsive and premium in dark mode.

---

## 1) Add hero banner to Checklist (same layout system)
### Requirements
- Create a top hero banner section on the Checklist page consistent with Address/Boxes:
  - Large title
  - Short subtitle
  - Mascot illustration on the right
  - Subtle gradient overlay for text contrast (darker left → lighter right)

### Banner copy (use exactly)
- Title: **Checklist**
- Subtitle: **“Tie up loose ends before you Moove.”**

### Acceptance criteria
- Checklist page shows a hero banner that visually matches Address/Boxes.

---

## 2) Use CowKeys.png (right side, bottom-flush)
### Requirements
- Use **CowKeys.png** as the banner illustration.
- Positioning:
  - Anchor to **bottom-right**
  - **Bottom edge of CowKeys.png touches the bottom edge** of the banner section (flush, no gap)
- Size:
  - Hero-sized (occupies ~40–60% of banner height)
  - Allow tasteful cropping off the right edge if needed to keep text readable
- No circular avatar framing; use the raw illustration.

### Acceptance criteria
- CowKeys.png is clearly visible, grounded to the bottom edge of the banner, and doesn’t collide with the title/subtitle.

---

## 3) Keep Checklist content intact (no functional changes)
### Requirements
- Do not change checklist tasks functionality.
- The hero banner is purely a layout/visual upgrade.

### Acceptance criteria
- Existing checklist behaviors remain unchanged; only the top header section is upgraded.

---

## 4) Responsive rules (must hold across screen sizes)
- Small phones:
  - If space is tight, crop the cow more to the right rather than shrinking text.
  - Maintain bottom-flush behavior.
- Tablets/desktop:
  - Use max-width container for content and avoid stretched typography.
  - Keep the cow crisp (no distortion).

### Acceptance criteria
- No overlap/clipping at any breakpoint; bottom flush is preserved.

---

## Final checklist
- [ ] Checklist page has a hero banner like Address/Boxes
- [ ] Banner image is CowKeys.png, anchored bottom-right, bottom edge flush
- [ ] Text remains readable with gradient overlay
- [ ] Fully responsive, dark-mode premium
- [ ] Checklist functionality unchanged