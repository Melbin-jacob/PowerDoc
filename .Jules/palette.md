## 2025-05-15 - Improving DownloadModal accessibility and keyboard support

**Learning:** When using `aria-live="polite"` for countdowns, it is better to apply it to the final status message ("Ready to download!") rather than the timer itself to avoid excessive screen reader announcements. Modals should always include `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` for proper accessibility.

**Action:** Implement focus management and keyboard listeners (Escape key) in all future modal or overlay components.
