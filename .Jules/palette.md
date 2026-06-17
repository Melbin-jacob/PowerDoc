## 2026-06-17 - Enhance Header navigation accessibility and UX
**Learning:** Dropdowns and mobile menus often lack standard keyboard navigation (Escape key) and intuitive mouse interaction (click-outside), which are critical for both accessibility and general UX. Using `useId` ensures stable ARIA relationships between triggers and containers.
**Action:** Always implement 'Escape' key listeners for modal-like UI elements and 'click outside' handlers for dropdowns. Ensure ARIA attributes (aria-expanded, aria-controls) are properly linked using stable IDs.
