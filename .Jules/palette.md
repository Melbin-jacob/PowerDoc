## 2025-05-14 - DownloadModal Accessibility & Focus Management
**Learning:** Combining countdown timer logic with global event listeners in a single `useEffect` can lead to the timer resetting if props for the listener (like `onClose`) are unstable (e.g., anonymous functions passed from parents).
**Action:** Always separate timer logic and global window listeners into different `useEffect` hooks to prevent unintended state resets.

## 2025-05-14 - Accessible Countdown Feedback
**Learning:** Using `aria-live="polite"` on a "Ready" status message is more effective for UX than putting it on the timer itself, which would cause excessive announcements.
**Action:** Apply `aria-live` to the final state change or significant milestones rather than high-frequency updates.
