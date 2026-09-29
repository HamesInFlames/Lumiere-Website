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
