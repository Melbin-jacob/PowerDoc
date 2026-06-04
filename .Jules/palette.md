## 2025-05-14 - Accessible Countdown Modal Pattern
**Learning:** Using `aria-live="polite"` on a status message that appears after a timed delay (like an ad countdown) ensures screen reader users are notified when the action becomes available without being interrupted by the ticking timer itself.
**Action:** Apply `aria-live="polite"` to "Ready" or "Success" states in modals that have async loading or countdown phases.

## 2025-05-14 - Robust Modal Backdrop Dismissal
**Learning:** For accessible modal components, implementing a backdrop click handler using `if (e.target === e.currentTarget)` prevents clicks inside the modal content from accidentally closing it while ensuring intuitive dismissal for mouse users.
**Action:** Use this pattern for all fixed-overlay components to improve user control and prevent accidental data loss.
