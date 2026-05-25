# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-05-14 - Optimized Keyboard Accessibility & Focus Management
**Learning:** Global 'Escape' key listeners should be optimized to only attach when the relevant UI state (e.g., a menu or modal) is active. Additionally, for buttons that become enabled after a delay (like countdown gates), programmatically moving focus to them significantly improves the experience for keyboard and screen reader users.
**Action:** Always conditionally attach event listeners in `useEffect` and use `useRef` to manage focus for asynchronous UI state changes.
