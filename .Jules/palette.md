## 2025-05-22 - [Header Accessibility & Interaction]
**Learning:** Dropdowns and mobile menus often lack standard keyboard support (Escape key) and ARIA relationship attributes, making them difficult for screen reader and keyboard users. Using 'mousedown' for click-outside handles interactions more reliably than 'click' in some React environments to avoid event propagation issues.
**Action:** Always implement 'Escape' key listeners and 'aria-controls' for any togglable UI element. Use 'useId' to ensure stable, unique IDs for ARIA relationships.
