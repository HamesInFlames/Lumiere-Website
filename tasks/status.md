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
