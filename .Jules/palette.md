## 2025-05-14 - Improve DownloadModal accessibility and interactions

**Learning:** When a primary interactive element (e.g., a 'Download' button) transitions from disabled to enabled after a timer or async process, programmatically move focus to that element to ensure users of assistive technology are immediately aware the action is available. Using `aria-live="polite"` on the status container instead of the countdown timer prevents excessive screen reader noise while still announcing completion.

**Action:** Always implement 'Escape' key and backdrop click listeners for modals, and consider proactive focus management for delayed primary actions.
