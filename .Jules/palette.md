## 2025-05-14 - Download Modal Accessibility and Interaction Improvements
**Learning:** Modals lack standard keyboard navigation (Escape key) and interaction patterns (backdrop click) by default in this app. Additionally, screen readers need explicit ARIA roles, attributes, and live regions to announce state changes like "Ready to download".
**Action:** Always implement `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Escape key listeners, and backdrop click handlers for modals. Use `aria-live="polite"` for non-timer status updates.
