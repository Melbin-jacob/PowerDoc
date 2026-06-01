## 2024-05-20 - Enhanced Modal and Header Accessibility

**Learning:** Modals should include `role="dialog"`, `aria-modal="true"`, and an `aria-labelledby` attribute pointing to the title to ensure proper screen reader support. Keyboard UX is significantly improved by implementing 'Escape' key listeners and managing focus (e.g., auto-focusing the primary button when it becomes enabled).

**Action:** Always include these ARIA attributes in modal components. Implement focus management for buttons that activate after a delay (like countdowns).

## 2024-05-20 - Accessible Navigation Menus

**Learning:** Dropdown triggers should include `aria-expanded` and `aria-haspopup` attributes. Menus should use `role="menu"` and links within them `role="menuitem"` for semantic correctness and better assistive technology support.

**Action:** Apply these roles and attributes to all navigation dropdowns and mobile menus.

## 2024-05-20 - ESLint and Unescaped Entities

**Learning:** Unescaped HTML entities (like quotes or apostrophes) in TSX components trigger ESLint `react/no-unescaped-entities` errors.

**Action:** Use character entities like `&quot;` or `&apos;` in TSX text content.
