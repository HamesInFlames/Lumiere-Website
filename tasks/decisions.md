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
