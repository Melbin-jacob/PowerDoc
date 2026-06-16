## 2025-05-14 - Accessible Modal Pattern
**Learning:** Modals should include `role="dialog"`, `aria-modal="true"`, and an `aria-labelledby` attribute pointing to the title to ensure proper screen reader support. Backdrop clicks and the 'Escape' key should also be handled for intuitive dismissal.
**Action:** Always implement these three ARIA attributes and two dismissal methods when creating or refining modal components.
