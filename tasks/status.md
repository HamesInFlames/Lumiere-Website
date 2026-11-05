# Session Status — Lumiere Website

## Last session
- **Date:** 2026-09-07
- **Tool used:** Claude Code
- **What was done:** Built `tasks/drinks-menu-audit.html` — interactive audit sheet (Hot/Cold/Add-on pills, new price + delta, approve/remove, notes, add rows, drag reorder, CSV export, generates the `sections` block for the live page; autosaves to localStorage). Also built `public/drinks-menu.html` — standalone, unlinked drinks menu (NFC target at `/drinks-menu.html`) with HOT / COLD / ADD-ONS split. All prices transcribed from the spreadsheet screenshot. Data lives in one editable `MENU` block at the top of the file.
- **What's next:** Confirm the "Double Espresso 3.85" row is actually Double Macchiato; review HOT/COLD placements with the team; decide on final drink list for the new physical board; optionally add descriptions/badges; program NFC tag with the live URL.
- **Blockers:** None.

## Session — 2026-10-22
- **Tool used:** Claude Code
- **What was done:** Synced the menu (`public/products.csv`) to Clover export 7: 39 prices changed, 7 shelf items now shown, 6 hidden (Salted Caramel Croissant, Raspberry Cheesecake Croissant, Chocolate Chip Croissant, Baklava Tart, Japanese Milk Bread, French Baguette), and 20 Clover items added with no photo yet. The menu shows 72 items. `FavouritesCarousel` now skips `hidden` items. `npm run build` passes. `npm run lint` shows the same 35 errors as before. Checked /menu, the home carousel (15 reloads, no hidden items) and a new product page at 1440px and 375px.
- **What's next:** Photos for the 20 new items. `/drinks-menu.html` isn't live (the URL falls through to the main site) and still has old drink prices. Pistachio Croissant has never had a photo.
- **Blockers:** None.

## Session — 2026-10-23 (SEO foundation)
- **Tool used:** Claude Code
- **Branch:** `seo/technical-foundation` (committed, not pushed).
- **What was done:** Per-page titles and descriptions, prerendered HTML per route, `public/robots.txt`, `dist/sitemap.xml` (75 URLs), Bakery and Product JSON-LD, 301 redirects from the old Shopify URLs (`/collections/gateaux-cakes` → `/menu#cakes`, `/collections/boulangerie` → `/menu#bread`, `/products/<slug>` → `/product/<slug>`, `/pages/about` → `/`, and others), `/drinks-menu` → `/drinks-menu.html`. See `tasks/decisions.md` (2026-10-23).
- **Verified:** `npm run build` passes (75 pages, 160 redirects). `npm run lint` 35 errors, same as before. Served with `serve dist -s` (today's start command): same as the live site plus redirects, robots.txt and sitemap; no page claims canonical `/`. Served with `serve dist` (no `-s`): every route has its own title and canonical; unknown URLs return 404. Browser check of home, menu, contact and a product at 1440px and 375px: pages look unchanged; one title, description and canonical after JS; no console errors. Reviewer: PASS (second pass, after a fix).
- **Railway start command:** changed to `npx serve dist -l $PORT` (dropped `-s`), approved by James. Committed on the branch; not pushed or merged yet.
- **What's next:** Push the branch and merge to main (Railway deploys main); then check the live site: `/menu` serves its own title, `/abc` returns 404, redirects work. Then: copy work (homepage H1, category pages, descriptions for the 40 shown products that have none), and confirm hours and price range (`llms.txt` says weekend hours vary and `$$$`; the site and schema say Tue–Sun 9–7 and `$$`). Old `/products?category=x` links now land on `/menu`, without the category.
- **Outside the code:** `lumierepatisserie.ca` without www doesn't resolve (no A record), so it needs a fix at the domain registrar. Also make the hours match on Google, Yelp, TripAdvisor and Uber Eats.
- **Blockers:** None.


## Session — 2026-10-23 (menu tabs on mobile)
- **Tool used:** Claude Code
- **Branch:** `fix/menu-tabs`, stacked on `seo/technical-foundation` (committed, not pushed). Merge after the SEO branch, or together.
- **Problem:** On phones the sticky category tabs on `/menu` felt unresponsive. The highlighted tab stayed off-screen for Pastries, Breads and Bakery Shelf. Tapping a far tab smooth-scrolled ~28,000px, and a fixed 800ms lock let the highlight flip to the neighbouring section mid-scroll. A first fix re-centred the tab row on every tap, which made the tapped pill slide sideways; that was reworked.
- **What was done (`src/pages/Menu.jsx`, `src/styles/Menu.css`):** Long tab jumps are instant, short ones smooth. The scroll lock is released when scrolling ends (scrollend, a position-stable fallback, a 1500ms cap, or user input). The scroll-spy listener is registered once. The tab row only scrolls to reveal a tab that is cut off, never for a visible one. Tab transitions are 0.15s with no overshoot. The hover style only applies on devices that can hover.
- **Verified:** Build passes, lint 35 (unchanged). Playwright at 375px (mouse and touch emulation) and 1440px: one highlight change per tap, a visible tapped tab doesn't move, the active tab stays visible while scrolling, `/menu#bread` and the Shopify redirects land correctly. James tried it locally: "Feels right now." Reviewer: PASS.
- **Not verified:** A real iPhone or Android phone.
- **What's next:** Push both branches and merge. Later idea: two cards per row on mobile (the menu page is ~35,000px tall at 375px).

## Session — 2026-11-05 (new photo mock: Strawberry Cheesecake)
- **Tool used:** Claude Code
- **Branch:** `ccr-6fa48463-7ae3sj`, fast-forwarded into `main` on James's request (live on Railway). The Railway sandbox environment idea was dropped for now.
- **What was done:** New photo for the full-size Strawberry Cheesecake (whole cake + slice on marble). The site shows every product in a square frame with `object-fit: cover`, so a plain swap would cut off the cake and the slice. Made a 1600×1600 version by stretching the empty marble above and below the cake (no AI fill, nothing on the cake changed), and smoothed the blocky JPEG patch in the top-left corner of the marble. New files sit next to the old ones (old photo kept for rollback): `public/images/cakes/Strawberry Cheesecake 2026.jpg` (1600², 311 KB) and `public/optimized/images/cakes/Strawberry Cheesecake 2026.webp` (1000², 50 KB, quality 82). Pointed `products.csv`, the `api.js` fallback and `imageMap.js` at it.
- **Verified:** `npm run build` passes (75 pages). Lint 35 errors (unchanged). Product page and /menu at 1440px and 375px: whole cake and slice visible, no console errors.
- **What's next:** Check the live product page once Railway finishes deploying. Repeat the same treatment as new photos arrive. The new photo is a wider shot, so the cake looks smaller in its card than the old-style neighbours until those are re-shot too.
- **Blockers:** None.
