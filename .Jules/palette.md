## 2025-05-14 - [DownloadModal Accessibility and UX]
**Learning:** Modals that feature a countdown timer for gated content (like ads) should programmatically move focus to the primary action button once the timer finishes. This provides a clear signal to keyboard and screen reader users that the content is now available. Additionally, using `aria-live="polite"` on the success state ensures the transition is announced by assistive technology.
**Action:** Always implement focus management and ARIA live regions for time-gated interactions to ensure accessibility and a smooth user flow.
