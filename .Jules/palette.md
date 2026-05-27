## 2025-05-15 - Improving Modal Accessibility and Focus Flow
**Learning:** For modals that have a delayed action (like a countdown), initial focus should be on a non-destructive element like the close button, and focus should be programmatically moved to the primary action once it becomes available to improve the workflow for keyboard and screen reader users.
**Action:** Always implement comprehensive focus management in modals, especially those with state changes, and ensure ARIA dialog attributes are present.
