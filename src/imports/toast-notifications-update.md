# Lovable Update Prompt: Moove — Toast Notifications Add “X” Close Button + Faster Dismiss

## Goal
Update all in-app action notifications (toasts/snackbars like “Item added”) so users can **dismiss them instantly** with an **X close button**, and they don’t hang around too long by default.

---

## Requirements

## 1) Add an “X” close affordance on every toast
- Every toast must include a clear, tappable **X** icon/button on the right side.
- The X must be:
  - Minimum 44px tap target (mobile-friendly)
  - High contrast in dark mode
  - Accessible label: “Dismiss notification”

### Acceptance criteria
- Any toast can be dismissed immediately by tapping X.

---

## 2) Reduce auto-dismiss duration + allow swipe
- Reduce default auto-dismiss time to **2.0–2.5 seconds**.
- Error toasts can remain longer (e.g., **4 seconds**) but still must have X.
- Add optional swipe-to-dismiss (right or down) if the component system supports it.

### Acceptance criteria
- Success/info toasts disappear quickly (≈2–2.5s).
- Error toasts linger slightly longer but still dismissible via X.
- Toasts never feel “stuck.”

---

## 3) Toast stacking + placement (phone-safe)
- Place toasts at the top (as currently) but ensure:
  - They don’t overlap critical nav elements
  - They respect safe-area insets (notch)
- If multiple toasts fire:
  - Stack neatly with small spacing
  - Limit visible to 2–3; queue the rest

### Acceptance criteria
- Toasts don’t cover important UI controls.
- Multiple toasts don’t create a wall of messages.

---

## 4) Visual style (Moove dark mode)
- Keep the current dark, rounded toast style.
- X button should match the theme (subtle, not loud), but clearly visible.
- The toast should animate in/out quickly (fade + slight slide). Respect reduced motion settings.

### Acceptance criteria
- Toast styling remains premium and consistent with Moove.
- X button is clearly visible and tappable.

---

## Final checklist
- [ ] Every toast has an X close button
- [ ] Success/info auto-dismiss is 2.0–2.5 seconds
- [ ] Errors auto-dismiss ~4 seconds
- [ ] Safe-area respected + stacking/queue behaves well
- [ ] Works responsively across screen sizes