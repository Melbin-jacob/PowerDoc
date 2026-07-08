## 2025-05-14 - Header Navigation Accessibility and Interaction

**Learning:** When implementing global event listeners (e.g., 'mousedown' for click-outside or 'keydown' for Escape) in a `useEffect` hook, it is critical to include the relevant state variables in the dependency array. Otherwise, the event handler functions will close over stale state values, leading to incorrect logic (e.g., trying to close a menu that the handler thinks is already closed). Additionally, mobile menus in SPAs should explicitly close when a link is clicked to provide immediate feedback.

**Action:** Always include state dependencies in `useEffect` for global listeners and ensure menu links have `onClick` handlers that close the menu.
