# Lovable Update Prompt: Moove — Boxes Page Gets Hero Banner (like Address) + Use BoxCow.png + Remove “+” Pattern Background

## Goal
Make the **Boxes** page match the **Address Changes** page structure:
- Add a **hero banner heading** at the top of Boxes (same style as Address).
- Use the provided banner art **BoxCow.png**.
- Remove the current background pattern with repeating **“+”** symbols from the Boxes content area.

Must remain fully responsive and dark-mode premium.

---

## 1) Add a hero banner to Boxes (match Address Changes layout)
### Requirements
- Create a top hero section on the Boxes page that mirrors Address Changes:
  - Large title typography
  - Short supportive subtitle
  - Mascot illustration on the right
- Keep the existing Move Out / Move In segmented control, but place it **below the banner** (not inside it) to avoid crowding.

### Banner copy (use exactly)
- Title (2-line style allowed):
  - **Boxes**
- Subtitle:
  - **“Keep your stuff easy to find.”**
  - (Alternate acceptable: “Pack smarter. Find everything fast.”)

### Acceptance criteria
- Boxes page has a hero banner at the top, visually consistent with Address Changes.
- Move mode toggle remains visible and usable below the banner.

---

## 2) Use BoxCow.png in the banner (right side, bottom-flush)
### Requirements
- Replace any existing box icon/banner art with **BoxCow.png**.
- Position it similar to AddressCow behavior:
  - Anchored to the **bottom-right**
  - The **bottom edge of BoxCow.png touches the bottom edge of the banner section** (flush, no gap)
- Make it hero-sized (not small):
  - Occupies ~40–60% of banner height
- Keep text readable with a subtle gradient overlay (darker on left behind text).

### Acceptance criteria
- BoxCow.png is clearly visible, bottom-flush to banner edge, and does not collide with the “Boxes” title.

---

## 3) Remove the repeating “+” background pattern from Boxes page
### Requirements
- Remove the patterned background behind the box grid (the repeating plus signs).
- Replace with a clean dark surface consistent with the rest of Moove:
  - Solid or very subtle noise/soft gradient (no repeating symbols)
- The box grid and group headers (EMPTY / PACKING / PACKED etc.) should sit on a clean background.

### Acceptance criteria
- No “+” pattern is visible anywhere on the Boxes page.
- The page looks cleaner and more premium.

---

## 4) Keep existing Boxes functionality intact
Do not break current behavior:
- Move Out / Move In toggle
- Search bar
- Grouped sections (Empty/Packing/Packed or Packed/Unpacking/Unpacked depending on mode)
- Icon grid tiles + badges + fragile marker
- Add (+) button remains accessible and thumb-friendly

### Acceptance criteria
- All existing Boxes features still work exactly as before; only layout and visuals change.

---

## 5) Responsive rules
- On small phones:
  - Banner text scales down slightly
  - BoxCow stays right/bottom flush, with more crop if necessary (do not overlap text)
- On tablets/desktop:
  - Use max-width container and avoid overstretching
  - Maintain premium spacing and readability

### Acceptance criteria
- No overlap, clipping, or awkward whitespace at any size.

---

## Final checklist
- [ ] Boxes page now has a hero banner like Address Changes
- [ ] Banner image is BoxCow.png, right-aligned, bottom-flush to section edge
- [ ] “+” pattern background removed entirely
- [ ] Move Out / Move In toggle placed below banner and still works
- [ ] All Boxes features remain functional and responsive