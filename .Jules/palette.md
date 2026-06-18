## 2025-05-15 - Accessible and interactive navigation menus
**Learning:** Dropdowns and mobile menus often lack standard interaction patterns like "Escape" to close and "click outside" dismissal, which are critical for keyboard users and general UX. Proper ARIA attributes (aria-expanded, aria-controls, roles) are essential for screen reader support in dynamic menus.
**Action:** Always implement `useEffect` based click-outside and Escape key listeners for any custom dropdown or modal, and ensure stable ARIA relationships using `useId`.
