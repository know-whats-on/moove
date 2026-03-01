# Lovable Update Prompt: Moove — Home Hero Banner (Bigger, Zoomed-In Cow Closeup)

## Goal
Update the **Home** page hero banner so the **HomeCow.png** mascot is **much bigger**, **zoomed in**, and positioned as a **close-up** anchored to the **bottom-right edge** of the banner (partially cropped for a premium, modern look). This must remain fully responsive across screen sizes.

---

## Requirements

## 1) Hero image sizing + crop behavior
- Replace the current small mascot placement with a **large close-up crop**:
  - HomeCow.png should take up roughly **55–70% of the banner height** visually.
  - The cow should feel “up close” (face + upper body emphasis).
- Use **cover-style cropping**:
  - `object-fit: cover`
  - `object-position: bottom right`
- Allow intentional cropping so the cow “bleeds” off the right and bottom edges slightly.

### Acceptance criteria
- On phone screens, the cow is clearly a close-up and visually dominant.
- The cow is anchored bottom-right and partially cropped (intentional, not accidental).

---

## 2) Layout layering (text stays readable)
- Keep greeting text left-aligned:
  - `Let’s Moove,`
  - `<Name>`
- Ensure the cow does NOT clash with text:
  - Add a subtle **left-to-right gradient overlay** on the banner background:
    - Darker behind text (left)
    - Fades lighter toward the cow (right)
- Maintain strong contrast for text in dark mode.

### Acceptance criteria
- No overlap between cow and text that harms readability.
- Text remains readable on all screens.

---

## 3) Responsive behavior (dynamic across screen sizes)
### Small phones
- Cow still appears as a close-up, but scale down slightly so it doesn’t overpower the greeting.
- Maintain bottom-right anchoring.
- If space is tight, crop more aggressively rather than shrinking the banner.

### Medium/large phones
- Cow becomes larger and more visible.
- Keep a pleasing balance: text block left, cow close-up right.

### Tablets/desktop
- Keep banner within max width; cow remains large but not stretched.
- Do not allow cow to become blurry or pixelated:
  - Prefer rendering HomeCow.png at high resolution.

### Acceptance criteria
- No clipping of text.
- Cow scales smoothly; no distortion.
- Banner always looks intentional at every breakpoint.

---

## 4) Implementation detail (how to build the banner)
Implement hero as a container with **absolute-positioned image**:

- Banner container: relative positioning, rounded corners, padding for text.
- Cow image: absolute positioned, bottom-right, oversized, cover-cropped.
- Gradient overlay: pseudo-element or overlay layer above image but below text.

### Acceptance criteria
- Cow is not treated as a small inline image.
- Cow is layered behind text with an overlay for contrast.

---

## Visual success checklist
- [ ] Cow is **much bigger** than before
- [ ] Cow is **zoomed in** (close-up)
- [ ] Cow is anchored to **bottom-right** and slightly cropped
- [ ] Greeting text remains readable with a gradient overlay
- [ ] Fully responsive across screen sizes (no breakage)