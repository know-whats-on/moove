# Lovable Fix Prompt: Moove — Align Home + Settings Banner Images to Bottom-Right (Match Boxes/Address)

## Goal
Home and Settings hero images are drifting left. Make **Home** and **Settings** banners use the **exact same image container + positioning rules** as **Boxes** and **Address**, so the mascot PNG is always **bottom-right anchored** and **flush to the right edge**.

---

## 1) Root cause to fix (likely)
Home/Settings banner images are probably placed in a flex/grid column (or have padding/margins) instead of being absolutely positioned like Boxes/Address.

**Fix:** Make Home and Settings use the same hero banner component structure as Boxes/Address:
- Banner card: `position: relative; overflow: hidden;`
- Mascot image: `position: absolute; right: 0; bottom: 0;`
- No padding/margin applied to the image wrapper.
- If any wrapper exists, it must be `position:absolute` too.

---

## 2) Apply the exact Boxes/Address mascot positioning rules to Home and Settings
### Requirements (non-negotiable)
For **Home** and **Settings** banners:

- The image layer must be:
  - `position: absolute`
  - `right: 0`
  - `bottom: 0`
- The rendered image must be:
  - `object-fit: contain` (preferred for full mascot) OR `cover` (if you want close-up), but consistent with Boxes/Address
  - `object-position: bottom right`
- The banner must not have right padding that affects the image.
  - Text block can have padding
  - Image layer must not

### Kill any left shift
- Remove any of the following from the image container on Home/Settings:
  - `margin-right`
  - `padding-right`
  - `left` positioning
  - flex alignment like `justify-content: space-between` where the image is a flex child
- If using a wrapper, set:
  - `right: 0; left: auto; transform: none;`

### Acceptance criteria
- On Home and Settings, the mascot touches the **right edge** and **bottom edge** of the banner exactly like Boxes/Address.
- No visible gap on the right.
- No “centered” or “slightly left” image.

---

## 3) Enforce consistency via a shared “HeroBanner” component
### Requirements
Create a single reusable `HeroBanner` component used by:
- Home (CowHome.png)
- Settings (CowSettings.png)
- Boxes (BoxCow.png)
- Address (AddressCow.png)
- Checklist (CowKeys.png)

The component must accept:
- `title`, `subtitle`
- `imageSrc`
- Optional `variant` for Home greeting layout, but **image positioning must remain identical**.

### Acceptance criteria
- Home/Settings banners are built from the same component as Boxes/Address (not custom one-offs).

---

## 4) Quick visual QA checklist
Test these screens after applying the fix:
- Home: CowHome.png right horn nearly touching the banner right edge (cropping allowed), bottom edge flush.
- Settings: CowSettings.png wrench/arm can crop slightly, but image must still be flush right and bottom.
- Compare with Boxes/Address: image alignment should be indistinguishable.

### Acceptance criteria
- Home and Settings match Boxes and Address banner alignment precisely.

---

## Final checklist
- [ ] Home mascot image is absolutely positioned with `right:0; bottom:0`
- [ ] Settings mascot image is absolutely positioned with `right:0; bottom:0`
- [ ] No flex/grid placement for mascot image in Home/Settings
- [ ] Shared HeroBanner component used across all sections
- [ ] Verified on small phone + larger phone widths (no drift left)