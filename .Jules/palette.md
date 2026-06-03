## 2025-05-22 - Focus management in countdown modals

**Learning:** When using a countdown timer that enables a button, users (especially keyboard users) benefit greatly from automatic focus management. Moving focus to the button as soon as it becomes enabled allows for immediate action without re-tabbing through the entire modal. Additionally, using `aria-live="polite"` for the final "Ready" state announcement provides clear feedback for screen reader users without being noisy during the countdown.

**Action:** Implement `auto-focus` logic in components that have deferred interactive states, and use polite live regions for transition announcements.
