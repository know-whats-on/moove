# Lovable Update Prompt: **Moove** — Home Page + Guided “How to Moove” Onboarding

## Goal
Update the current Dashboard into a **Home** page with a Moove-themed greeting, and add a first-run guided onboarding (a walkthrough) that teaches the app by highlighting real UI sections. Add a “How to Moove” button in Settings to replay it anytime.

Use the provided mascot image asset (HomeCow.png) as the Home hero illustration.

---

## 1) Rename Dashboard → Home (everywhere)
### Requirements
- Rename the bottom-nav label from **Dashboard** to **Home**.
- Rename the page title and any internal references from Dashboard to Home.

### Acceptance criteria
- Bottom nav shows: Home, Boxes, Address, Checklist, Settings.
- The top header/title reads **Home** (or no title if the hero header is used, but the route name is Home).

---

## 2) Home greeting format + name capture
### Greeting text rules
- Replace “Good evening, Moo!” with this exact greeting format:

**Line 1:** `Let’s Moove,`  
**Line 2:** `<Name>`

(Keep the comma after Moove. Use a curly apostrophe if available: `Let’s`.)

### Name logic
Add a simple user profile field:
- `user_name: string | null`

#### First visit behavior
- If onboarding is **skipped**, immediately prompt for name after closing the onboarding.
- If onboarding is **completed**, ask for name at the end (or immediately after completion).
- If name is unknown and the user lands on Home (e.g., app reopened), show:
  - `Let’s Moove,`
  - `friend` (temporary fallback)
  - and prompt softly: “What should I call you?” with a single input.

### Name prompt UI
- Use a Moove-themed modal (rounded card, dark mode ready):
  - Title: “What should I call you?”
  - Input placeholder: “Type your name…”
  - Primary button: “Save”
  - Optional: “Not now” (keeps fallback ‘friend’)

### Acceptance criteria
- Greeting always follows the exact 2-line format.
- User can set and later change name (change name lives in Settings).

---

## 3) First-run onboarding: Guided “How to Moove” walkthrough (modal + stepper)
### Overview
On first app launch (first visit), show a themed onboarding experience that teaches the app by guiding the user through the actual navigation and sections.

This onboarding must feel playful and on-brand (Highland Cow theme), with **Skip**, **Back**, **Next** controls, and “spotlight” style focus on the relevant UI element.

### Trigger conditions
- Show onboarding automatically only if:
  - `has_seen_onboarding = false`
- Persist:
  - `has_seen_onboarding: boolean`

### UX structure
- Present as a **full-screen modal overlay** with:
  - Dimmed background
  - A “spotlight” cutout highlighting the relevant section
  - A floating tooltip card containing:
    - Step title
    - Short explanation
    - Progress indicator (e.g., “2 of 6”)
    - Controls: Back / Next
  - Top-right: **Skip**

### Onboarding steps (must use real app UI targets)
Create a guided sequence that navigates users to the real sections:

#### Step 1 — Welcome to Moove (Home)
- Spotlight: hero banner area
- Copy:
  - Title: “Welcome to Moove”
  - Body: “Moo will help you keep boxes, addresses, and tasks tidy. Let’s do a quick tour.”

#### Step 2 — Add your first box
- Spotlight: the Home quick action button **Add Box** (or the + on Boxes)
- Copy:
  - Title: “Start with boxes”
  - Body: “Add boxes as you pack. Moove will show Empty, Packing, and Packed automatically.”

#### Step 3 — Boxes tab
- Action: On Next, switch to **Boxes** tab automatically
- Spotlight: Boxes icon grid + status groups
- Copy:
  - Title: “Your boxes live here”
  - Body: “Tap a box to add items. Seal it when it’s packed.”

#### Step 4 — Ask Moove (AI)
- Spotlight: the Ask button / chat FAB
- Copy:
  - Title: “Ask Moove”
  - Body: “Try ‘Where is my charger?’ or ‘List everything in Box Bedroom 1’.”

#### Step 5 — Address Changes
- Action: On Next, switch to **Address** tab automatically
- Spotlight: categorized checklist area
- Copy:
  - Title: “Update addresses”
  - Body: “Work through categories like Bank, Utilities, and Friends. Check off as you go.”

#### Step 6 — Checklist tab
- Action: On Next, switch to **Checklist** tab automatically
- Spotlight: checklist list/timeline
- Copy:
  - Title: “Don’t miss move-out tasks”
  - Body: “Notice, cleaning, condition report, bond, keys. Keep it simple.”

#### Step 7 — Settings + replay tour
- Action: On Next, switch to **Settings** tab automatically
- Spotlight: new button **How to Moove**
- Copy:
  - Title: “Replay anytime”
  - Body: “Tap ‘How to Moove’ whenever you want a refresher.”

#### Final — Name capture
- After Step 7 completes (or after Skip), show the name prompt (if name not set).

### Controls
- **Skip** ends onboarding immediately and sets `has_seen_onboarding=true`, then (if name missing) show name prompt.
- **Back** goes to previous step and returns to previous tab if the step changed tab.
- **Next** advances step and performs tab navigation when needed.

### Accessibility
- Respect reduced motion: no large animated transitions, just fades.
- Ensure spotlight and tooltip text is readable in dark mode.

### Acceptance criteria
- First run automatically launches the tour.
- Tour highlights real UI elements, not fake screens.
- Back/Next/Skip work correctly across tabs.
- Onboarding completion persists.
- Skipping still leads to name prompt (if missing).

---

## 4) Settings: “How to Moove” replay button
### Requirements
Add a Settings section called **Help** with:
- Button: **How to Moove**
  - On tap: re-trigger the onboarding walkthrough from Step 1.
- Also include:
  - “Change name” option (edit `user_name`)
  - “Reset onboarding” (optional) which sets `has_seen_onboarding=false`

### Acceptance criteria
- Settings contains a visible “How to Moove” button.
- Tapping it reliably replays the guided tour.

---

## 5) Home page hero art update (use provided mascot)
### Requirements
- Replace the current photographic cow circle image with the provided mascot asset:
  - Use **HomeCow.png** as the hero illustration.
- Style:
  - Keep hero as a wide banner with the mascot on the right (or slightly overlapping), matching the current layout but cartoon-like.
  - Maintain dark mode contrast: hero background should be slightly lighter than page background, with warm Moove accent highlights.

### Acceptance criteria
- Home uses HomeCow.png (cartoon mascot) as the hero image.
- No real/photographic cow images remain on Home.

---

## Final checklist
- [ ] “Dashboard” renamed to “Home” across nav and routes
- [ ] Greeting is exactly:
  - `Let’s Moove,`
  - `<Name>`
- [ ] First-run guided onboarding with Skip/Back/Next that navigates across real tabs
- [ ] Settings has “How to Moove” button to replay onboarding
- [ ] If onboarding is skipped, prompt for name immediately after
- [ ] Home hero uses HomeCow.png (no photo cow)