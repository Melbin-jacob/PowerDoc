## 2025-03-24 - DownloadModal Accessibility & Focus Management
**Learning:** For modals with delayed actions (like ad countdowns), adding `aria-live="polite"` to the status text and automatically focusing the action button when it becomes enabled significantly improves UX for screen reader and keyboard users.
**Action:** Implement 'Escape' key listeners, backdrop click-to-close, and focus management (auto-focusing enabled primary actions) in all modal components.
