'use client';

// Promise.try was added in Chrome 134 / Firefox 134 (2025).
// pdfjs-dist v5 uses it internally — polyfill for older browsers.
if (typeof Promise.try === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Promise as any).try = function <T>(fn: () => T | PromiseLike<T>): Promise<T> {
    return new Promise<T>((resolve) => resolve(fn()));
  };
}

export default function Polyfills() {
  return null;
}
