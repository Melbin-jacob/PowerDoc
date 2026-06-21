## 2025-05-14 - Accessible and Interactive Dropdowns
**Learning:** Dropdowns without a full-screen backdrop require a 'click outside' handler using a `ref` and a `mousedown` listener on the document for intuitive dismissal. Additionally, global 'Escape' key listeners in React functional components should be attached to the `window` object with proper cleanup and conditional attachment to ensure keyboard accessibility and prevent memory leaks.
**Action:** Use `useRef` for container detection and `useEffect` with cleanup for `mousedown` and `keydown` event listeners when implementing interactive menus.

## 2025-05-14 - Reducing Lint Noise from Third-Party Artifacts
**Learning:** Minified library artifacts (like `pdf.worker.min.mjs`) can trigger thousands of ESLint warnings, obscuring project-specific errors.
**Action:** Add known third-party or minified artifacts to `globalIgnores` in `eslint.config.mjs` early to maintain a clean and actionable lint output.
