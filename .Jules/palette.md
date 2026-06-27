# Palette's Journal - Critical UX/Accessibility Learnings

This journal records critical UX and accessibility learnings discovered during the development of PowerDoc.

## 2025-05-14 - Download Modal Accessibility & Interaction

**Learning:** When implementing countdown-gated interactions, accessibility must be proactive. 1. Use `aria-live="polite"` for the final status change ("Ready") rather than the ticking timer to avoid screen reader noise. 2. Programmatically move focus to the now-enabled primary action (Download button) so keyboard/SR users don't have to hunt for it. 3. Standard modal expectations (Escape to close, click backdrop to close) are essential for "invisible" UX.

**Action:** Always pair status transitions with focus management and ensure modal primitives (Escape/Backdrop) are implemented even in custom lightweight modals.
