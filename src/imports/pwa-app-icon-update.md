# Lovable Update Prompt: Moove — Use **AppIcon.png** as the PWA Home Screen Icon (iOS + Android)

## Goal
Set **AppIcon.png** as the official app icon when users install the Moove PWA on:
- **iOS (Add to Home Screen)**
- **Android (Install app)**

Assume **AppIcon.png** already exists in the app’s file assets.

---

## 1) Add AppIcon.png to the correct public/static assets location
### Requirements
- Ensure `AppIcon.png` is stored in the app’s **public/static** files so it can be referenced by:
  - PWA manifest icons
  - iOS apple-touch-icon
  - favicon (optional)

**Acceptance criteria**
- AppIcon.png is accessible at a stable URL path (e.g., `/AppIcon.png` or `/icons/AppIcon.png`).

---

## 2) Update the PWA Web App Manifest (Android + general PWA)
### Requirements
Update `manifest.json` (or equivalent Lovable PWA config) to reference AppIcon.png as icons.

- Set:
  - `name`: `Moove`
  - `short_name`: `Moove`
  - `display`: `standalone`
  - `start_url`: `/`
  - `theme_color` and `background_color` consistent with dark mode

- Icons:
  - Use AppIcon.png for multiple sizes.
  - If only one file is available, generate multiple resized versions at build time OR declare one and ensure the platform can scale.
  - Preferred sizes:
    - 192x192
    - 512x512
    - (Optional) 180x180 for Apple touch icon, but iOS prefers link tags (see section 3)

Example manifest icon entries (use actual paths):
- `src`: `/icons/AppIcon-192.png`, `sizes`: `192x192`, `type`: `image/png`
- `src`: `/icons/AppIcon-512.png`, `sizes`: `512x512`, `type`: `image/png`

**Acceptance criteria**
- On Android “Install app”, the installed icon uses AppIcon.png (not a default browser icon).
- PWA passes basic manifest icon checks.

---

## 3) Add iOS-specific icons (apple-touch-icon)
### Requirements
iOS does not rely solely on manifest icons. Add these to the HTML head:

- `<link rel="apple-touch-icon" href="/icons/AppIcon-180.png">`
- (Optional) additional sizes:
  - 152x152, 167x167, 180x180

Also set:
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<meta name="apple-mobile-web-app-title" content="Moove">`

**Acceptance criteria**
- On iOS “Add to Home Screen”, the icon is AppIcon.png (not a screenshot/favicon).

---

## 4) Generate required icon sizes from AppIcon.png (if not already available)
### Requirements
If the project currently has only `AppIcon.png`, create resized versions and save them into app files:

Create:
- `AppIcon-180.png` (iOS)
- `AppIcon-192.png` (PWA)
- `AppIcon-512.png` (PWA)
- (Optional) `AppIcon-167.png`, `AppIcon-152.png`

All should be PNG and optimized.

**Acceptance criteria**
- Icon files exist and are referenced correctly by manifest + apple-touch-icon tags.

---

## 5) Favicon (optional but recommended)
### Requirements
Set the favicon to AppIcon-derived sizes:
- `/favicon.ico` (optional)
- `/favicon-32.png`, `/favicon-16.png` (optional)

**Acceptance criteria**
- Browser tab icon looks like Moove.

---

## Final validation checklist
- [ ] AppIcon.png (and resized variants) are saved in the app’s public/static files
- [ ] manifest.json references 192 and 512 icons derived from AppIcon
- [ ] iOS apple-touch-icon set to 180px (and optional sizes)
- [ ] iOS Add to Home Screen shows the correct Moove icon
- [ ] Android Install App shows the correct Moove icon