## 2025-05-15 - Disclosure Pattern for Navigation Dropdowns
**Learning:** For simple navigation dropdowns, using `role="menu"` and `role="menuitem"` requires a full implementation of the WAI-ARIA Menu pattern, including arrow key navigation. Without it, the screen reader experience is incomplete and potentially confusing.
**Action:** Prefer the "disclosure" pattern (using `aria-expanded`, `aria-haspopup`, and `aria-controls`) for navigation-only dropdowns to provide a semantic and accessible experience without the complexity of a full menu system.
