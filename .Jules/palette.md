## 2025-05-28 - Accessible Modals and Focus Management
**Learning:** Modals require specific ARIA attributes (`role="dialog"`, `aria-modal="true"`) and keyboard listeners (Escape key) to be truly accessible. Additionally, for time-gated interactions (like ad countdowns), automatically moving focus to the enabled action button provides a seamless transition for keyboard and screen reader users.
**Action:** Always include ARIA landmarks and Escape key handlers for modals, and implement proactive focus management for interactive elements that change state asynchronously.

## 2025-05-28 - React State Synchronization
**Learning:** Calling `setState` synchronously within a `useEffect` triggers cascading renders and ESLint errors. A better pattern for adjusting state based on props/store changes is to perform the check and update in the component body before rendering.
**Action:** Use the "adjusting state based on props" pattern in the component body instead of `useEffect` for synchronous state synchronization to improve performance and code health.
