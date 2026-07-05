## 2025-05-14 - Modal Accessibility and Interaction
**Learning:** When implementing a modal that gates content (e.g., via a timer), always provide standard 'way out' interactions—such as 'Escape' key and backdrop click—to maintain user control and meet accessibility expectations.
**Action:** Always include 'Escape' key listeners and backdrop click handlers in modal components.

## 2025-05-14 - Programmatic Focus on State Change
**Learning:** For users navigating via keyboard, programmatically moving focus to a newly-enabled primary action (like a 'Download' button after a countdown) eliminates the need for manual tabbing and makes the interface feel much more responsive and intuitive.
**Action:** Use `useRef` and `useEffect` to move focus to primary action buttons as soon as they transition from disabled to enabled.
