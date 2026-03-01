# Lovable Update Prompt: Moove — Address Changes Banner Uses AddressCow.png (Bottom-Edge Flush)

## Goal
Update the **Address Changes** page hero/banner to use the provided mascot art **AddressCow.png** and position it so the **bottom edge of the cow image touches (is flush with) the bottom edge of the banner section** (no floating gap). The banner must remain responsive across screen sizes and keep text readable.

---

## 1) Replace banner image asset
### Requirements
- Replace the current circular/location icon (or any existing header art) with **AddressCow.png**.
- Use it as the primary hero illustration for the Address Changes page.

### Acceptance criteria
- Address Changes banner displays AddressCow.png, not the previous icon.

---

## 2) Positioning: bottom edge flush to section edge
### Requirements
- The cow image must be anchored so its **bottom edge is flush with the banner container’s bottom edge**.
- No padding/margin under the image inside the banner. The cow should feel “grounded” on the section edge.

### Implementation guidance (visual behavior)
- Use an absolute-positioned image inside a relative banner container:
  - Anchor: `bottom: 0`
  - Horizontal: `right: 0` (preferred) or `right: 8–16px` depending on readability
- Use cover-style scaling to keep it large and crisp:
  - `object-fit: contain` if you want the full cow visible
  - or `object-fit: cover` if you want a close-up crop
- Ensure the **visible bottom** of the image touches the banner bottom edge at all breakpoints.

### Acceptance criteria
- On phone screens, there is **no visible gap** between the bottom of the cow art and the bottom border/edge of the banner section.
- On tablets/desktops, the same flush-bottom behavior remains.

---

## 3) Size + emphasis (match Moove style)
### Requirements
- Make the cow noticeably larger than a small icon:
  - It should occupy roughly **40–60% of the banner height**.
- Keep the cow on the **right side** of the banner so the left side remains for the heading/subtitle.

### Acceptance criteria
- The cow reads as a hero illustration, not an icon.

---

## 4) Text readability: gradient overlay
### Requirements
- Maintain “Address Changes” title and subtitle on the left.
- Add a subtle gradient overlay behind text so it remains readable regardless of cow brightness:
  - Darker on left behind text
  - Fades toward the right where the cow is

### Acceptance criteria
- Title/subtitle are always readable in dark mode.
- Cow remains vibrant and not muddied by overlays.

---

## 5) Responsive rules
### Small phones
- Scale cow down slightly if needed, but keep bottom flush.
- If the cow competes with text, crop more to the right (do not shrink text).

### Large phones/tablets
- Cow can be bigger; keep max-width container for content.
- Avoid pixelation: ensure the source image renders sharp.

### Acceptance criteria
- No overlaps, clipping of text, or awkward whitespace at any screen size.
- Bottom-flush requirement holds on all devices.

---

## Final checklist
- [ ] Address Changes banner uses AddressCow.png
- [ ] Cow anchored bottom-right with **bottom edge flush** to banner bottom
- [ ] Cow is hero-sized (not a tiny icon)
- [ ] Text remains readable via gradient overlay
- [ ] Fully responsive across screen sizes