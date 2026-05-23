## 2025-05-15 - [DownloadModal Accessibility & Keyboard Interaction]
**Learning:** For countdown-based action buttons (like a "wait for ad" download button), automatically focusing the button once it becomes enabled significantly improves keyboard navigation flow. Without this, a keyboard user would have to manually find the button again after it shifts from disabled to enabled.
**Action:** Always implement focus management for delayed-activation buttons to guide the user's focus to the next logical action.
