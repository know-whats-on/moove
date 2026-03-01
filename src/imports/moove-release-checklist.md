# Lovable Prompt: Pre-Release Code Debug + Production Readiness Check (Moove)

## Goal
Before public release, run a thorough **code debug + production readiness pass** on Moove. Identify and fix issues that could break core flows, responsiveness, PWA installability, performance, and accessibility. Do not add new features.

---

## 1) Run automated checks (must)
- Run **TypeScript/JS linting** and fix all errors/warnings that could impact runtime.
- Run **type checks** and resolve type errors.
- Run a **production build** and fix build-time errors.
- Scan console logs:
  - No uncaught exceptions
  - No failed network requests (unless intentionally offline-safe)
  - Remove noisy debug logs in production

### Acceptance criteria
- Clean build passes with zero fatal errors.
- No critical console errors on core pages.

---

## 2) Core flow functional QA (must)
Test and fix issues across these user flows:

### Home
- Sticky hero banner works (content scrolls only)
- Greeting displays `Let’s Moove, <Name>`
- Days Until Moove calculates correctly
- Distance card shows “Mooving ### miles away” or proper empty state
- Home responsiveness across small/large screens

### Boxes
- Hero banner image is bottom-right anchored (no left drift)
- Move Out / Move In toggle works and persists
- Status icon logic correct (Empty/Packing/Packed/Unpacking/Unpacked)
- Search matches **Box labels + Item names** and results navigate to correct box
- Add box drop + confetti respects reduced motion
- Quick-add supports name + quantity + Enter-to-add
- Toast notifications have **X** dismiss and proper auto-dismiss timing

### Address Changes
- Banner image bottom-right anchored and bottom-flush
- Categories render correctly, custom items work, completion toggles work

### Checklist
- Banner image bottom-right anchored and bottom-flush
- Tasks editable, completion toggles work

### Settings
- Banner image bottom-right anchored and bottom-flush
- “How to Moove” replays onboarding
- Move details update countdown + distance
- PWA icon config references AppIcon assets correctly

### Ask Moove (Smart Finder)
- “Where is my…” autocompletes from Items
- “List everything in…” autocompletes from Box names
- Clear chat/history works
- No hallucinations: results only from database
- Deep links open the correct box

### Acceptance criteria
- All flows above work end-to-end without errors.

---

## 3) Responsiveness + layout stability (must)
Perform a responsive sweep and fix:
- No overlapping text/buttons
- No clipped banner images or drifting alignment
- Sticky headers do not cover content; content has correct top padding
- Bottom nav never covers inputs/buttons; safe-area padding applied
- Keyboard interactions:
  - AI sheet input visible above keyboard
  - Box quick-add inputs visible above keyboard
- Grid stability:
  - Boxes icon tiles wrap cleanly (2 columns small phones, expand on larger)
  - Labels never overflow outside tiles

### Acceptance criteria
- No layout breakpoints fail on small phones (e.g., 320px width).
- No horizontal scroll appears.

---

## 4) PWA install + icon verification (must)
Verify and fix:
- Web app manifest loads
- `display: standalone`
- App name/short name correct
- Theme/background colors set
- AppIcon-derived icons present and referenced:
  - 192, 512 for manifest
  - 180 apple-touch-icon (iOS)
- Service worker/offline behavior does not break app startup

### Acceptance criteria
- PWA install works on Android and iOS Add to Home Screen shows correct icon.

---

## 5) Performance + UX polish (must)
- Reduce slow renders:
  - Debounce searches (150–250ms)
  - Avoid unnecessary rerenders when typing
- Ensure images are optimized:
  - Banner PNGs not oversized
  - Icons compressed appropriately
- Toasts:
  - X close button present
  - Auto-dismiss 2–2.5s (success/info), ~4s errors

### Acceptance criteria
- App feels snappy on mid-range phones; no jank on scroll.

---

## 6) Accessibility + usability checks (must)
- Tap targets 44px+
- Color contrast in dark mode meets accessibility guidelines
- Focus states visible
- Screen-reader labels for:
  - Close toast “Dismiss notification”
  - Clear chat “Clear history”
  - Ask Moove input “Ask Moove”
- Reduced motion respected (no confetti/bounce when enabled)

### Acceptance criteria
- Key controls are usable with assistive tech and touch.

---

## 7) Release checklist output (required)
After debugging, produce a short **Release Readiness Report** containing:
- ✅ What passed
- ⚠️ Issues fixed (bulleted)
- ❗ Remaining risks (if any) with recommended fixes
- A final “Ready to ship” / “Not ready” verdict

### Acceptance criteria
- Report is concrete and references actual fixes made.

---

## Non-goals
- Do not add new features.
- Do not redesign UI beyond fixing bugs and ensuring spec compliance.
- Do not change data models except to resolve bugs.

---

## Final acceptance criteria
- Production build passes
- No critical console errors
- Core flows verified
- Responsive + sticky headers correct
- PWA install and icons correct
- App feels fast and reliable for public release