## 2025-05-15 - Accessible Modal Focus Management
**Learning:** For modals with delayed interactive elements (like a countdown before a download button is enabled), users can be left in a "focus trap" or lose context when the button finally activates. Explicit focus management is required to guide keyboard users to the primary action once it becomes available.
**Action:** Use a `useEffect` to monitor the enabled state of delayed buttons and programmatically call `.focus()` on the element's ref when it transitions to enabled.

## 2025-05-15 - Reducing Screen Reader Noise in Countdowns
**Learning:** Applying `aria-live="polite"` to a parent container containing a rapidly updating timer (e.g., every second) causes screen readers to redundantly announce the entire string repeatedly, creating a poor experience.
**Action:** Wrap only the terminal or critical status messages (e.g., "Ready to download!") in the `aria-live` region, or use milestone-based updates, to keep announcements meaningful and concise.
