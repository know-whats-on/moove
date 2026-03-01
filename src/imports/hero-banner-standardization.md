# Lovable Update Prompt: Moove — Make **Home** + **Settings** Hero Banners Match Boxes/Address/Checklist Exactly

## Goal
Update the **Home** and **Settings** hero banner **container + image positioning** so they are implemented **the same way** as the existing **Boxes, Address, and Checklist** hero banners.

This means:
- Same banner container structure (spacing, radius, gradients, layering)
- Same image anchoring behavior (bottom-right edge, bottom flush)
- Same responsive rules and max-width behavior

---

## 1) Standardize the “Hero Banner Component” (single shared pattern)
Create/ensure a reusable hero banner pattern used across **all** pages:
- Boxes
- Address
- Checklist
- Home
- Settings

### Hero Banner Component Structure (must match existing pages)
- **Outer container** (page section wrapper):
  - Full width
  - Uses the same top padding/margins as Boxes/Address/Checklist
- **Banner card** (the actual banner):
  - `position: relative`
  - `overflow: hidden`
  - Same border radius as other pages
  - Same dark gradient background
  - Same internal padding for the text block (left side)
- **Gradient overlay layer**:
  - Left side darker to protect text
  - Fades toward the right where the mascot sits
- **Mascot image layer**:
  - `position: absolute`
  - **anchored bottom-right** (right=0, bottom=0)
  - Bottom edge flush with the banner’s bottom edge
  - No padding/margin around the image container
- **Text block layer** (above overlays):
  - Title and subtitle (or greeting)
  - Same font sizes/weights/line spacing rules as Boxes/Address/Checklist

### Acceptance criteria
- Home and Settings hero banners are visually and structurally indistinguishable from Boxes/Address/Checklist, except for copy and image asset.

---

## 2) Apply the shared hero banner pattern to HOME
### Requirements
- Replace the current Home header implementation with the same banner component.
- Asset: **CowHome.png**
- Image positioning must be identical to other pages:
  - bottom-right edge anchored
  - bottom flush (no gap)
  - allow tasteful crop if needed, but no distortion

### Home text rules (keep exactly)
- Line 1: **Let’s Moove,**
- Line 2: **<Name>**
- (No extra greeting lines.)

### Acceptance criteria
- Home hero banner uses the shared component pattern.
- CowHome.png behaves exactly like BoxCow/AddressCow/CowKeys images in those banners.

---

## 3) Apply the shared hero banner pattern to SETTINGS
### Requirements
- Add a hero banner to Settings using the same banner component.
- Asset: **CowSettings.png**
- Image positioning identical:
  - bottom-right edge anchored
  - bottom flush (no gap)

### Settings banner copy (use exactly)
- Title: **Settings**
- Subtitle: **“Tweak your Moove. Replay the tour anytime.”**

### Acceptance criteria
- Settings hero banner matches the shared component pattern exactly.
- CowSettings.png behaves exactly like the other section banner mascots.

---

## 4) Hard positioning rules (must match other sections)
For BOTH Home and Settings banners:
- Mascot image must touch the banner’s **right edge** and **bottom edge** (right=0, bottom=0).
- Do not wrap the image in a padded container.
- If there’s a need to add spacing, do it via cropping/scale, not margins.

### Acceptance criteria
- No visible gap between the image and the bottom-right edges of the banner container.

---

## 5) Responsive rules (mirror existing banners)
- Small phones:
  - If space is tight, crop image more on the right/top rather than shrinking text.
- Large phones/tablets:
  - Respect max-width content container (do not stretch banner too wide)
  - Keep mascot crisp (no distortion)

### Acceptance criteria
- Banner looks correct at all breakpoints and matches the behavior of Boxes/Address/Checklist banners.

---

## Final checklist
- [ ] Home banner container + image positioning matches Boxes/Address/Checklist banner implementation
- [ ] Settings banner container + image positioning matches Boxes/Address/Checklist banner implementation
- [ ] Mascot images are bottom-right anchored and bottom flush (no gaps)
- [ ] Gradient overlay and text padding match existing sections
- [ ] Responsive behavior matches existing sections