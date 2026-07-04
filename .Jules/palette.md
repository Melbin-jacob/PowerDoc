## 2026-07-04 - Enhance DownloadModal accessibility and focus management
**Learning:** When a primary interactive element (like a 'Download' button) transitions from disabled to enabled after a timer, programmatically moving focus to it significantly improves the experience for keyboard and screen reader users, making the next step immediately obvious.
**Action:** Always consider programmatic focus shifts for elements that become available after an asynchronous wait or countdown.
