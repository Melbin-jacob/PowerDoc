# PowerDoc — PDF Editor & Document Converter

A free, browser-based PDF editor and document converter. Users upload a file, edit or convert it, and download the result. **No files are ever sent to a server.** All processing runs entirely in the user's browser using client-side JavaScript.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Prerequisites](#3-prerequisites)
4. [Getting Started](#4-getting-started)
5. [Project Structure](#5-project-structure)
6. [Pages & Routes](#6-pages--routes)
7. [Components](#7-components)
8. [State Management (Stores)](#8-state-management-stores)
9. [Features In Detail](#9-features-in-detail)
10. [Admin Panel](#10-admin-panel)
11. [Advertising System](#11-advertising-system)
12. [Known Limitations](#12-known-limitations)
13. [Deployment](#13-deployment)
14. [Extending the Project](#14-extending-the-project)
15. [Git History](#15-git-history)

---

## 1. Project Overview

| Property | Value |
|----------|-------|
| **Project name** | PowerDoc |
| **Framework** | Next.js 16.2.6 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Package manager** | npm |
| **Node.js required** | v18 or higher |
| **Branch** | `claude/pdf-editor-converter-H6FCZ` |

### Core design decisions

- **No server-side file processing.** Every PDF operation (render, edit, merge, split, compress, convert) runs in the browser via WebAssembly and JavaScript libraries. There is no backend API, no file storage, and no database.
- **No user accounts.** The site is entirely public. The only persistent state is admin settings, stored in the visitor's own `localStorage`.
- **Revenue model.** The site is ad-supported. A configurable ad countdown gate appears before downloads. Ad slots (top banner, left sidebar, right sidebar) accept custom HTML/AdSense code pasted in the admin panel.

---

## 2. Technology Stack

### Languages
| Language | Version | Usage |
|----------|---------|-------|
| TypeScript | ^5 | All source code |
| CSS | — | Global styles via Tailwind |
| HTML | — | JSX / React components |

### Frameworks & Core Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.6 | Full-stack React framework (App Router) |
| `react` / `react-dom` | 19.2.4 | UI rendering |
| `tailwindcss` | ^4 | Utility-first CSS framework |

### PDF & Document Processing

| Package | Version | Purpose |
|---------|---------|---------|
| `pdf-lib` | ^1.17.1 | Create, edit, merge, split, rotate, compress PDFs |
| `pdfjs-dist` | ^5.7.284 | Render PDF pages to canvas (preview) |
| `mammoth` | ^1.12.0 | Extract text from DOCX/DOC Word documents |
| `jspdf` | ^4.2.1 | Installed (fallback); primary Word→PDF now uses pdf-lib |
| `html2canvas` | ^1.4.1 | Installed (fallback); not actively used |

### UI & Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `zustand` | ^5.0.13 | Lightweight state management (two stores) |
| `lucide-react` | ^1.14.0 | Icon library |
| `react-hot-toast` | ^2.6.0 | Toast notifications |
| `react-dropzone` | ^15.0.0 | Installed; drag-and-drop handled natively in components |

### Dev / Build

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5 | Type checking |
| `eslint` + `eslint-config-next` | 16.2.6 | Linting |
| `@tailwindcss/postcss` | ^4 | PostCSS integration for Tailwind v4 |

---

## 3. Prerequisites

| Requirement | Minimum version | Check command |
|-------------|----------------|---------------|
| Node.js | 18.x LTS or higher | `node -v` |
| npm | 8.x or higher | `npm -v` |
| Git | any recent | `git -v` |

> **Windows users:** Use the official Node.js installer from [nodejs.org](https://nodejs.org). Do not use the version bundled with some IDEs — it may be outdated.

---

## 4. Getting Started

### Clone and install

```bash
# 1 — Clone the repository
git clone <your-repo-url>
cd PowerDoc

# 2 — Check out the working branch
git checkout claude/pdf-editor-converter-H6FCZ

# 3 — Install all dependencies
npm install

# 4 — Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Available scripts

```bash
npm run dev      # Development server with hot reload (Turbopack)
npm run build    # Production build — also runs TypeScript type-check
npm run start    # Serve the production build locally
npm run lint     # ESLint check
```

> `npm run build` must pass with zero errors before deploying. TypeScript errors will fail the build.

---

## 5. Project Structure

```
PowerDoc/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout — ad slots, Header, Footer, Polyfills
│   ├── globals.css             # Global CSS, Tailwind import, reusable class utilities
│   ├── page.tsx                # Home page — hero, feature grid, drop zone
│   ├── editor/
│   │   ├── layout.tsx          # Suspense boundary (required for useSearchParams)
│   │   └── page.tsx            # PDF Editor — view, text, rotate, merge, split, compress
│   ├── converter/
│   │   ├── layout.tsx          # Suspense boundary
│   │   └── page.tsx            # Document Converter — Word→PDF, Images→PDF, PDF→JPG
│   ├── admin/
│   │   └── page.tsx            # Admin panel — login, ad settings
│   ├── privacy/
│   │   └── page.tsx            # Privacy Policy (static, server-rendered)
│   └── terms/
│       └── page.tsx            # Terms of Service (static, server-rendered)
│
├── components/
│   ├── AdSlot.tsx              # Renders top / left / right / inline ad placeholders or custom HTML
│   ├── DownloadModal.tsx       # 30-second ad countdown modal shown before any download
│   ├── Footer.tsx              # Site footer with navigation links
│   ├── Header.tsx              # Navigation header with Tools dropdown, mobile menu
│   └── Polyfills.tsx           # Client-side polyfill for Promise.try (required by pdfjs v5)
│
├── store/
│   ├── adminStore.ts           # Zustand store — admin settings, persisted to localStorage
│   └── fileStore.ts            # Zustand store — in-memory pending file (home→editor handoff)
│
├── public/
│   └── pdf.worker.min.mjs      # pdfjs-dist worker (local copy — avoids CDN dependency)
│
├── next.config.ts              # Next.js config (Turbopack enabled)
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies and scripts
└── postcss.config.mjs          # PostCSS config for Tailwind v4
```

---

## 6. Pages & Routes

| Route | File | Type | Description |
|-------|------|------|-------------|
| `/` | `app/page.tsx` | Client | Home — hero section, drop zone, feature grid, privacy notice |
| `/editor` | `app/editor/page.tsx` | Client | Full PDF editor with tool sidebar |
| `/editor?tool=merge` | same | Client | Opens editor with Merge tool active |
| `/editor?tool=split` | same | Client | Opens editor with Split tool active |
| `/editor?tool=compress` | same | Client | Opens editor with Compress tool active |
| `/converter` | `app/converter/page.tsx` | Client | Document converter (defaults to Word→PDF) |
| `/converter?tool=word-to-pdf` | same | Client | Converter with Word→PDF pre-selected |
| `/converter?tool=images-to-pdf` | same | Client | Converter with Images→PDF pre-selected |
| `/converter?tool=pdf-to-jpg` | same | Client | Converter with PDF→Images pre-selected |
| `/admin` | `app/admin/page.tsx` | Client | Password-protected admin panel |
| `/privacy` | `app/privacy/page.tsx` | Server (static) | Privacy Policy |
| `/terms` | `app/terms/page.tsx` | Server (static) | Terms of Service |

All `?tool=` parameters are read with `useSearchParams()`, which requires each page to be wrapped in a `<Suspense>` boundary (implemented in each `layout.tsx`).

---

## 7. Components

### `AdSlot.tsx`
Renders an advertising slot. Reads visibility settings from `adminStore`. If custom HTML code has been pasted in the admin panel, it renders that via `dangerouslySetInnerHTML`. Otherwise renders a dashed placeholder box.

**Props:**
```ts
position: 'top' | 'left' | 'right' | 'inline'
className?: string
```

**Slot dimensions:**
| Position | Size |
|----------|------|
| `top` | 728×90 px (full-width responsive) |
| `left` | 160×600 px |
| `right` | 160×600 px |
| `inline` | 468×60 px |

Left and right sidebar ads are hidden on screens narrower than the `xl` Tailwind breakpoint (1280 px).

---

### `DownloadModal.tsx`
Modal overlay shown whenever a user initiates a download from the editor or converter.

**Behaviour:**
- If `adBeforeDownload` is `true` in `adminStore`, shows an ad placeholder area and an animated SVG countdown ring. The download button is disabled until the countdown reaches zero.
- If `adBeforeDownload` is `false`, skips straight to the ready state and the button is immediately active.
- Ad duration is controlled by `adDuration` (seconds) from `adminStore`.

**Props:**
```ts
fileName: string        // shown to the user
onDownload: () => void  // called when the user clicks the download button
onClose: () => void     // called when the user closes the modal
```

---

### `Header.tsx`
Sticky top navigation bar. Contains:
- Logo / brand link (`/`)
- Tools dropdown (PDF Editor, Document Converter)
- Privacy and Terms links
- "Get Started Free" CTA button
- Hamburger menu for mobile

---

### `Footer.tsx`
Site-wide footer. Contains brand blurb, tools links, legal links, copyright year (dynamic), and the privacy/terms disclaimer line.

---

### `Polyfills.tsx`
A `'use client'` component that renders nothing (`return null`) but installs a `Promise.try` polyfill if the browser doesn't have it. Rendered as the very first child of `<body>` in `layout.tsx`.

**Why it exists:** `pdfjs-dist` v5 internally calls `Promise.try()`. This API was added in Chrome 134 / Firefox 134 (early 2025). Older browsers throw `TypeError: Promise.try is not a function` without this polyfill.

---

## 8. State Management (Stores)

### `store/adminStore.ts`

Uses **Zustand with `persist` middleware** (saves to `localStorage` under the key `powerdoc-admin`).

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `adBeforeDownload` | `boolean` | `true` | Show ad countdown before every download |
| `adDuration` | `number` | `30` | Countdown length in seconds (5–60) |
| `topBannerEnabled` | `boolean` | `true` | Show / hide the top banner slot |
| `sidebarAdsEnabled` | `boolean` | `true` | Show / hide left + right sidebar slots |
| `topBannerCode` | `string` | `''` | Custom HTML/AdSense for top banner |
| `leftAdCode` | `string` | `''` | Custom HTML/AdSense for left sidebar |
| `rightAdCode` | `string` | `''` | Custom HTML/AdSense for right sidebar |
| `isLoggedIn` | `boolean` | `false` | Admin session flag (NOT persisted) |

**Actions:** `login(password)`, `logout()`, `updateSetting(key, value)`

> **Security note:** The admin password is hardcoded in `store/adminStore.ts` as the constant `ADMIN_PASSWORD = 'powerdoc2024'`. Change this before going to production. For a production deployment, replace this with an environment variable and a proper backend auth check.

---

### `store/fileStore.ts`

Uses **Zustand without persistence** (in-memory only, reset on page refresh).

| Field | Type | Description |
|-------|------|-------------|
| `pendingFile` | `File \| null` | File object waiting to be loaded by the editor or converter |

**Actions:** `setPendingFile(file)`, `clearPendingFile()`

**How it works:** When a user drops or selects a file on the home page, `setPendingFile(file)` is called, then `router.push('/editor')` or `router.push('/converter')` navigates to the right tool. The destination page runs a `useEffect` on mount, detects the pending file, loads it, and calls `clearPendingFile()`.

---

## 9. Features In Detail

### PDF Editor (`/editor`)

All operations use **pdf-lib** for manipulation and **pdfjs-dist** for rendering the preview canvas.

| Tool | How it works |
|------|-------------|
| **View** | pdfjs renders the current page to a `<canvas>` at 1.5× scale. Page navigation arrows step through pages. |
| **Add Text** | User enters text and X/Y coordinates. pdf-lib draws the text onto the page at `(x, height − y − fontSize)` using the built-in standard font. |
| **Rotate** | pdf-lib reads the current page rotation angle and adds ±90°. |
| **Delete Page** | pdf-lib `removePage(index)`. Blocked if only one page remains. |
| **Merge** | User adds multiple PDF files. pdf-lib creates a new document, copies all pages from each source document in order. |
| **Split** | User enters comma-separated page numbers. pdf-lib creates one new single-page PDF per number and immediately downloads each. |
| **Compress** | pdf-lib re-saves the document with `useObjectStreams: true`. This is lossless structural compression; it reduces metadata overhead but does not re-compress embedded images. |

**Preview rendering flow:**
1. `loadPDF(file)` reads the file as `ArrayBuffer`, loads it with `PDFDocument.load()` (pdf-lib), sets `pdfBytes` and `pdfDoc` state.
2. A `useEffect` watching `[pdfBytes, currentPage]` runs after a 50 ms timeout (to guarantee the `<canvas>` DOM node exists).
3. `pdfjs-dist` is imported dynamically. Its worker is pointed at `/pdf.worker.min.mjs` (local file in `public/`).
4. pdfjs renders the page to the canvas.

---

### Document Converter (`/converter`)

#### Word → PDF
1. `mammoth.extractRawText({ arrayBuffer })` extracts plain text from the DOCX file.
2. A new A4 PDF is created with `PDFDocument.create()` (pdf-lib).
3. Each paragraph is word-wrapped to fit within the page margins using `font.widthOfTextAtSize()`.
4. Text is drawn line by line; new pages are added automatically when `y` goes below the bottom margin.
5. The output PDF is saved and passed to `DownloadModal`.

> **Formatting note:** Only plain text is preserved. Tables, images, charts, and rich formatting (bold, italic, colours, headers) are stripped. This is a fundamental limitation of client-side DOCX processing.

#### Images → PDF
1. Each image file is read as `ArrayBuffer`.
2. JPEG files use `doc.embedJpg()`; PNG/WEBP use `doc.embedPng()`.
3. Images larger than A4 (595×842 pt) are scaled down proportionally.
4. Each image becomes one page sized exactly to the image dimensions.

#### PDF → Images (JPG)
1. pdfjs-dist loads the PDF.
2. Each page is rendered to an off-screen `<canvas>` at 2× scale.
3. `canvas.toBlob()` converts to JPEG at 0.92 quality.
4. Each image is downloaded immediately via a temporary `<a>` element.

---

### Home Page File Drop Zone

The upload zone uses a `<label htmlFor="hero-upload">` wrapping the visible content. The actual `<input type="file">` is hidden. Clicking the label natively opens the file picker in all browsers. Drag-and-drop is handled by `onDrop` on the outer `<div>`.

File type routing:
- `.pdf` → `/editor`
- `.doc` / `.docx` → `/converter?tool=word-to-pdf`
- Everything else → `/converter`

The `File` object is stored in `fileStore` before navigation so the destination page can auto-load it.

---

## 10. Admin Panel

URL: `/admin`

### Logging in

Default password: **`powerdoc2024`**

To change it, edit the constant in `store/adminStore.ts`:
```ts
const ADMIN_PASSWORD = 'powerdoc2024';  // ← change this
```

The `isLoggedIn` flag is stored in Zustand memory only (not in `localStorage`), so the session ends on page refresh.

### Settings

#### Download Ad Gate
- **Enable ad before download** — toggle on/off. When on, every download (from editor or converter) shows `DownloadModal` with a countdown.
- **Ad duration slider** — 5 to 60 seconds, in 5-second steps.

#### Ad Space Visibility
- **Top banner** — toggles the `AdSlot position="top"` in the root layout.
- **Sidebar ads** — toggles both `AdSlot position="left"` and `position="right"`.

#### Ad Code
Three textarea fields for raw HTML (e.g. Google AdSense `<script>` tags):
- Top banner code
- Left sidebar code
- Right sidebar code

Leave empty to show placeholder dashed boxes (useful for development / testing).

All settings persist to `localStorage` under the key `powerdoc-admin`.

---

## 11. Advertising System

### Slot layout

```
┌─────────────────────────────────────────────────────────┐
│                  TOP BANNER (728×90)                    │
├──────────────────────────────────────────────────────── ┤
│  Header / Navigation                                    │
├───────────┬─────────────────────────────┬───────────────┤
│  LEFT AD  │                             │  RIGHT AD     │
│ (160×600) │     Page content            │  (160×600)    │
│           │                             │               │
└───────────┴─────────────────────────────┴───────────────┘
```

Left and right sidebars only appear at `xl` breakpoint (≥1280 px screen width).

### Connecting Google AdSense

1. Get your AdSense publisher ID and ad unit codes from [Google AdSense](https://adsense.google.com).
2. Log in to `/admin`.
3. Paste each ad unit's `<script>` snippet into the corresponding code field.
4. Click **Save Settings**.
5. Also add the AdSense `<script src="...">` global tag to `app/layout.tsx` inside `<head>` (add a `<Script>` component from `next/script`).

### Download ad placeholder

The `DownloadModal` currently shows a styled placeholder box where the ad should appear. To show a real ad in the modal:

1. Open `components/DownloadModal.tsx`.
2. Find the `{/* Ad area */}` block.
3. Replace the placeholder `<div>` with your ad unit code.

---

## 12. Known Limitations

| Limitation | Detail |
|------------|--------|
| Word formatting | DOCX→PDF strips all formatting. Only plain text is preserved. Tables, images, fonts, and styles are not supported. |
| PDF images compression | The "Compress" tool does lossless structural compression only. It does not re-encode embedded images. |
| Password-protected PDFs | pdf-lib cannot open password-protected PDFs. The editor will show an error toast. |
| Very large files | Files over ~50 MB may cause the browser tab to run out of memory, especially during merge or preview rendering. |
| Browser compatibility | pdfjs-dist v5 requires a modern browser. The `Promise.try` polyfill covers Chrome 100+, Firefox 100+, Edge 100+, Safari 16+. |
| No undo/redo | The editor does not have an undo stack. Reloading the original file is the only way to undo changes. |
| Admin password | The password is hardcoded in the client bundle. It provides basic gatekeeping but is not cryptographically secure. |

---

## 13. Deployment

### Vercel (recommended — zero config)

```bash
npm install -g vercel
vercel deploy
```

Vercel auto-detects Next.js and builds correctly.

### Self-hosted (Node.js)

```bash
npm run build
npm run start       # starts on port 3000
```

Use a reverse proxy (nginx / Caddy) in front of it.

### Self-hosted (Docker) — example

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment variables

There are currently **no required environment variables**. The app runs with defaults.

For production hardening, you can extract the admin password:

1. Add to `.env.local`:
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=your-strong-password
   ```
2. In `store/adminStore.ts` replace:
   ```ts
   const ADMIN_PASSWORD = 'powerdoc2024';
   ```
   with:
   ```ts
   const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'powerdoc2024';
   ```

> Note: `NEXT_PUBLIC_` variables are embedded into the client bundle at build time. For a truly secret password, you need a server-side auth endpoint.

---

## 14. Extending the Project

### Adding a new PDF tool

1. Add a new value to the `Tool` union in `app/editor/page.tsx`:
   ```ts
   type Tool = 'view' | 'text' | 'rotate' | 'merge' | 'split' | 'compress' | 'your-tool';
   ```
2. Add an entry to the `tools` array for the sidebar button.
3. Add a conditional panel block `{activeTool === 'your-tool' && (...)}` above the preview canvas.
4. Implement the logic using `pdfDoc` (pdf-lib `PDFDocument`) and call `triggerDownload()` when done.

### Adding a new conversion type

1. Add an entry to `conversionOptions` in `app/converter/page.tsx`.
2. Add the type to the `ConversionTool` union.
3. Write a `convertXxx` async function and wire it into `handleConvert`.

### Replacing the admin password system

For a real multi-user setup, replace the Zustand-based login with NextAuth.js:

```bash
npm install next-auth
```

Then create `app/api/auth/[...nextauth]/route.ts` and wrap protected pages with a session check.

### Adding a real ad in the download modal

Open `components/DownloadModal.tsx` and find:

```tsx
{/* Ad area */}
{adBeforeDownload && !canDownload && (
  <div className="px-6 pt-5">
    <div className="ad-slot rounded-xl" style={{ height: '200px', width: '100%' }}>
```

Replace the inner content with your ad unit script tag.

---

## 15. Git History

| Commit | Description |
|--------|-------------|
| `312a25a` | `feat:` Initial build — all pages, components, stores, legal pages |
| `bb6f080` | `chore:` Project docs and public static assets |
| `e130430` | `fix:` PDF upload not displaying — switched from CDN worker to local `/pdf.worker.min.mjs`, added drag-and-drop, separate file input refs, render error state |
| `7039629` | `fix:` `Promise.try` polyfill for browsers older than Chrome 134 |
| `b8944f4` | `fix:` Home page upload (label fix + fileStore handoff), Word→PDF empty output (replaced jsPDF.html with pdf-lib text layout) |

---

## Quick Reference Card

```
Start dev server        npm run dev               → http://localhost:3000
Production build        npm run build
Admin panel             http://localhost:3000/admin
Default admin password  powerdoc2024              (change in store/adminStore.ts)
Ad slots                layout.tsx → AdSlot components
Download ad gate        components/DownloadModal.tsx
pdfjs worker            public/pdf.worker.min.mjs
Browser polyfill        components/Polyfills.tsx
File handoff store      store/fileStore.ts
Admin settings store    store/adminStore.ts
```
