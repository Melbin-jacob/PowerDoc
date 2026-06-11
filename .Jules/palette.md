## 2025-05-22 - Navigation Accessibility & Keyboard Navigation
**Learning:** Enhancing navigation components requires a dual approach: semantic ARIA attributes (`aria-expanded`, `aria-controls`) to inform assistive technologies of state changes, and global keyboard listeners (`Escape` key) to ensure interactive elements can be dismissed predictably.
**Action:** Always implement `aria-expanded` and `aria-controls` for dropdown triggers, and use a `useEffect` hook to manage global `Escape` key listeners with proper cleanup.
