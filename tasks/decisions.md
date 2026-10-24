# Architecture Decisions — Lumiere Website

### 2025 — Dual-service Railway deployment
- **Decision:** Separate frontend and backend services on Railway
- **Reason:** Independent scaling, cleaner deployment pipeline

### 2025 — Resend API for email
- **Decision:** Use Resend over SendGrid/Mailgun
- **Reason:** Simpler API, better DX, reasonable pricing

### 2025 — Optimized product images
- **Decision:** Keep optimized images in repo (744MB total)
- **Reason:** Only 154KB is actual source code, images are deployment assets

### 2026-10-22 — The menu comes from Clover
- **Decision:** Clover POS is the source of truth for which items are sold and at what price. Don't hand-edit prices, add items or hide items in `public/products.csv`. Make the change in Clover, export, and run `clover/sync-website-menu.py` from the lumiere-system repo. It syncs prices, hides items that are hidden in or missing from Clover (category `hidden`), and adds new Clover items. Names, descriptions and images of existing items stay hand-written here.
- **Kept off the website on purpose:** drinks, Individual Cookies, Coffee Beans, the challahs, the day-old breads, the single One Biter, Green Apple and Pomegranate.
- **Reason:** The website was one price update behind Clover (35 of 51 shown items) and out of step on which items were sold.

### 2026-10-23 — Technical SEO: prerendered pages from a post-build script
- **Decision:** `npm run build` runs `vite build && node scripts/prerender.js`. The script writes one HTML file per real route (`dist/_home.html`, `dist/menu/index.html`, `dist/contact/index.html`, `dist/product/<slug>/index.html`) with its own title, description, canonical, Open Graph tags, JSON-LD (Bakery on home/contact, Product on product pages) and a plain-HTML copy of the page's content inside `#root`. `createRoot().render()` replaces that copy when JS runs. It also writes `dist/sitemap.xml`, `dist/404.html` and `dist/serve.json` (301s from the old Shopify URLs, rewrites, `cleanUrls:false`, `directoryListing:false`). `src/lib/usePageMeta.js` keeps the tags right on in-app navigation. Shared data lives in `src/lib/seo.js`.
- **`dist/index.html` stays the plain Vite template on purpose:** `serve -s` returns it for every extensionless URL, so it must not carry a canonical or the home snapshot.
- **Railway start command is now `npx serve dist -l $PORT` (no `-s`), approved by James 2026-10-23.** With `-s`, serve rewrote every extensionless URL to `index.html` before looking for files, so the per-page HTML was never served. Without it, `dist/serve.json` rewrites `/`, `/menu`, `/contact` and `/product/:slug` to their files, and unknown URLs get `dist/404.html` with a real 404 status (the React app still boots on it).
- **Plain JS, not TypeScript:** `seo.js` is imported by the browser bundle and by `scripts/prerender.js` under plain Node; the repo has no TS toolchain.
- **No packages added.** No SSR framework.
- **Reason:** the live site served the same empty HTML for every URL, had no robots.txt or sitemap, and old Shopify URLs (`/collections/...`, `/products/...`, `/pages/about`) returned the homepage with a 200.


### 2026-10-24 — kc-workflow plugin enabled for this repo
- **Decision:** `.claude/settings.json` registers the `kc-tools` marketplace (private repo `HamesInFlames/kc-tools`) and enables `kc-workflow@kc-tools`, so sessions in this repo load the KC workflow: global rules, the worker/builder/reviewer agents, `/kc-workflow:reflect`, and a Playwright MCP (`npx @playwright/mcp@0.0.83`, run by Claude Code, not a project dependency).
- **Note:** fetching the marketplace needs GitHub access to the private kc-tools repo. Interactive sessions ask to install it when the folder is trusted.
