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
- **Branch:** `seo/technical-foundation`, merged to `main` and live since 2026-10-23 (`9241efd`).
- **What was done:** Per-page titles and descriptions, prerendered HTML per route, `public/robots.txt`, `dist/sitemap.xml` (75 URLs), Bakery and Product JSON-LD, 301 redirects from the old Shopify URLs (`/collections/gateaux-cakes` → `/menu#cakes`, `/collections/boulangerie` → `/menu#bread`, `/products/<slug>` → `/product/<slug>`, `/pages/about` → `/`, and others), `/drinks-menu` → `/drinks-menu.html`. See `tasks/decisions.md` (2026-10-23).
- **Verified:** `npm run build` passes (75 pages, 160 redirects). `npm run lint` 35 errors, same as before. Served with `serve dist -s` (today's start command): same as the live site plus redirects, robots.txt and sitemap; no page claims canonical `/`. Served with `serve dist` (no `-s`): every route has its own title and canonical; unknown URLs return 404. Browser check of home, menu, contact and a product at 1440px and 375px: pages look unchanged; one title, description and canonical after JS; no console errors. Reviewer: PASS (second pass, after a fix).
- **Railway start command:** changed to `npx serve dist -l $PORT` (dropped `-s`), approved by James. Live since 2026-10-23.
- **What's next:** Submit `https://www.lumierepatisserie.ca/sitemap.xml` in Google Search Console and request indexing for `/` and `/menu`. Then: copy work (homepage H1, category pages, descriptions for the 40 shown products that have none), and confirm hours and price range (`llms.txt` says weekend hours vary and `$$$`; the site and schema say Tue–Sun 9–7 and `$$`). Old `/products?category=x` links now land on `/menu`, without the category.
- **Outside the code:** `lumierepatisserie.ca` without www doesn't resolve (no A record), so it needs a fix at the domain registrar. Also make the hours match on Google, Yelp, TripAdvisor and Uber Eats.
- **Blockers:** None.

## Session — 2026-10-23 (menu tabs on mobile)
- **Tool used:** Claude Code
- **Branch:** `fix/menu-tabs`, merged to `main` together with the SEO branch and live since 2026-10-23 (`9241efd`).
- **Problem:** On phones the sticky category tabs on `/menu` felt unresponsive. The highlighted tab stayed off-screen for Pastries, Breads and Bakery Shelf. Tapping a far tab smooth-scrolled ~28,000px, and a fixed 800ms lock let the highlight flip to the neighbouring section mid-scroll. A first fix re-centred the tab row on every tap, which made the tapped pill slide sideways; that was reworked.
- **What was done (`src/pages/Menu.jsx`, `src/styles/Menu.css`):** Long tab jumps are instant, short ones smooth. The scroll lock is released when scrolling ends (scrollend, a position-stable fallback, a 1500ms cap, or user input). The scroll-spy listener is registered once. The tab row only scrolls to reveal a tab that is cut off, never for a visible one. Tab transitions are 0.15s with no overshoot. The hover style only applies on devices that can hover.
- **Verified:** Build passes, lint 35 (unchanged). Playwright at 375px (mouse and touch emulation) and 1440px: one highlight change per tap, a visible tapped tab doesn't move, the active tab stays visible while scrolling, `/menu#bread` and the Shopify redirects land correctly. James tried it locally: "Feels right now." Reviewer: PASS.
- **Not verified:** A real iPhone or Android phone.
- **What's next:** Later idea: two cards per row on mobile (the menu page is ~35,000px tall at 375px).

## 2026-10-23 — Live check after deploy
- `main` at `9241efd` deployed by Railway in about 2.5 minutes.
- Checked on https://www.lumierepatisserie.ca: `/`, `/menu`, `/contact`, `/product/tiramisu-cake` serve their own title and canonical in the raw HTML; `/abc` returns 404; `robots.txt` and `sitemap.xml` (75 URLs) load; `/collections/boulangerie` → `/menu#bread`, `/collections/gateaux-cakes` → `/menu#cakes`, `/products/fraisier` → `/menu`, `/pages/about` → `/`, `/drinks-menu` → `/drinks-menu.html` (loads). Menu tabs at 375px: a tap highlights only the tapped tab, a visible tab doesn't move, scrolling into Breads highlights Breads; no JS errors.
- Still open: the bare domain `lumierepatisserie.ca` doesn't resolve (registrar DNS); confirm hours and price range with the shop; test on a real phone.

## Session — 2026-11-11 (Hanukkah pre-order page)
- **Tool used:** Claude Code
- **Branch:** `feat/hanukkah-preorder` (not pushed, not merged).
- **What was done:** New page `/hanukkah` ("Hanukkah 2026 sufganiyot pre-order") built from the approved mockup `tasks/hanukkah-mockups/option-c.html`: title row with button, a bold full-width order-ahead notice ("Order at least 2 days before pickup", butter-yellow bar) directly under it, 3-step strip, pickup-day chips (Fri Dec 4 to Fri Dec 11, closed Mon Dec 7), Classic ($3.95) and Fancy ($7.25) flavour grids, closing bar, sticky "Pre-order now" bar on mobile. No pickup time anywhere (owner change). Tapping a flavour opens a hand-written lightbox (name, tier, price; Esc, backdrop, arrow keys; focus returns to the tile; body scroll locked). The header nav has a fourth item "Hanukkah Pre-Order" after Menu (desktop and mobile menu); a small `Header.css` rule keeps four items on one row between 601px and 1000px. SEO: own title, description, canonical, prerendered HTML (`dist/hanukkah/index.html`), sitemap entry (76 URLs) and a serve.json rewrite, same as `/menu`. All content lives in `src/lib/hanukkah.js`.
- **Form URL:** `HANUKKAH_FORM_URL` in `src/lib/hanukkah.js` is empty, so every pre-order button shows a disabled "Pre-orders open soon".
- **Images:** `public/images/hanukkah/<slug>.jpg` (800px, fetched by the Google Form script), `<slug>.webp` (800px) and `<slug>-400.webp`, 11 flavours, about 1.4 MB total.
- **Verified:** build passes (76 pages), lint 35 errors (unchanged). Pickup ends Fri Dec 11 everywhere (no "Dec 12" left in page, raw HTML or meta); notice moved from beside the Classic photos to the top, in the prerendered HTML too. Browser check at 1440px and 375px; screenshots in `tasks/hanukkah-mockups/built/`.
- **Local only:** `tasks/hanukkah-mockups/` (mockups and screenshots) is not committed.
- **What's next:** Paste the Google Form URL into the constant, then merge and deploy.
- **Blockers:** Google Form URL.
