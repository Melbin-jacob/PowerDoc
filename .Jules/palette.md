## 2025-05-14 - Improve Header accessibility and interaction

**Learning:** When implementing global 'Escape' key listeners in React functional components, use the `useEffect` hook to attach the listener to the `window` object and provide a cleanup function to `removeEventListener` on unmount to prevent memory leaks and ensure correct behavior. Additionally, mobile menu toggles should use a dynamic `aria-label` (e.g., 'Open menu' vs 'Close menu') that reflects the current state of the menu.

**Action:** Always include cleanup functions for global event listeners and ensure interactive elements have state-aware ARIA labels.
