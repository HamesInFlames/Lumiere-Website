# Lumière Pâtisserie

<div align="center">

**A modern, elegant website for an artisan French pâtisserie in Canada**

[Live Website](https://www.lumierepatisserie.ca) | [Contact](mailto:eliran@lumierepatisserie.ca)

</div>

---

## About

Lumière Pâtisserie is a French pâtisserie bringing authentic European pastry craftsmanship to Canada. This website serves as their digital storefront, showcasing their handcrafted cakes, pastries, breads, and specialty items with a dynamic product catalog, professional photography, and a seamless mobile-first experience.

---

## Features

- **Dynamic Product Catalog** — Categorized display of cakes, pastries, breads, one-biters, personal desserts, and bakery shelf items with individual product pages
- **CSV-Based Content Management** — Update products, prices, descriptions, and allergen info via spreadsheet with no code changes required
- **Allergen Information System** — Dedicated allergen-free and allergen-contains display with color-coded indicators (green for free, red for contains)
- **Responsive Design** — Mobile-first layout with hamburger navigation, touch-friendly tabs, and optimized scroll behavior
- **Favourites Carousel** — Swiper-powered interactive showcase of featured products
- **Contact Form** — Direct inquiry form powered by Resend email API with validation and formatted HTML emails
- **Google Maps Integration** — Embedded location for easy wayfinding
- **Uber Eats Integration** — Branded ordering button for delivery
- **Image Optimization** — Automated Sharp-based image pipeline (reduced assets from 282MB to 4MB — 98.6% reduction)
- **Rainbow Gradient UI** — Animated gradient accents on active tabs matching the site's header theme

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 + Vite 7 |
| **Routing** | React Router v7 |
| **Styling** | CSS Modules (page-specific) |
| **Carousel** | Swiper.js |
| **Image Optimization** | Sharp |
| **Backend** | Express (Node.js 20+) |
| **Email** | Resend API |
| **Deployment** | Railway (frontend + backend) |

---

## Project Structure

```
Lumiere-Website/
├── src/
│   ├── App.jsx                    # Root component with routing
│   ├── main.jsx                   # Entry point
│   ├── components/
│   │   ├── Header.jsx             # Navigation with mobile hamburger menu
│   │   ├── Footer.jsx             # Contact info, hours, location
│   │   ├── FavouritesCarousel.jsx  # Swiper-powered product showcase
│   │   ├── ShowcaseImage.jsx       # Hero/feature images
│   │   ├── VisitUs.jsx            # Google Maps location section
│   │   └── ScrollToTop.jsx        # Scroll reset on route change
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── Menu.jsx               # Full product menu with category tabs
│   │   ├── Contact.jsx            # Contact form (Resend API)
│   │   └── Products/
│   │       ├── index.jsx          # Product catalog grid
│   │       └── Product.jsx        # Individual product detail page
│   ├── lib/
│   │   ├── api.js                 # Product data layer (CSV parsing, fallback data)
│   │   └── imageMap.js            # Optimized image path mapping
│   └── styles/                    # Page-specific CSS modules
│       ├── Header.css
│       ├── Home.css
│       ├── Menu.css
│       ├── Contact.css
│       ├── Product.css
│       ├── Collection.css
│       ├── Footer.css
│       └── VisitUs.css
├── backend/
│   ├── server.js                  # Express API (contact form, health check)
│   ├── package.json
│   └── railway.json               # Backend deployment config
├── public/
│   ├── products.csv               # Product data (prices, descriptions, allergens)
│   ├── images/                    # Optimized product photography by category
│   │   ├── cakes/
│   │   ├── pastries/
│   │   ├── breads/
│   │   ├── personal-desserts/
│   │   ├── one-biters/
│   │   ├── bakery-shelf/
│   │   └── web-design/
│   └── optimized/                 # Sharp-processed images
├── scripts/
│   └── optimize-images.js         # Automated image optimization pipeline
├── railway.json                   # Frontend deployment config
├── vite.config.js
├── package.json
├── CHANGELOG.md
└── ROADMAP.md
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (frontend on :8000, proxies /api to :3000)
npm run dev

# In a separate terminal, start the backend
cd backend && npm install && npm run dev

# Build for production
npm run build

# Optimize images (requires Sharp)
npm run optimize-images
```

---

## Environment Variables

### Backend (`backend/`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `3000` |
| `RESEND_API_KEY` | Resend API key for contact form emails | — |
| `MAIL_TO` | Recipient email for contact form | `contact@lumierepatisserie.ca` |
| `MAIL_FROM` | Sender email address | `onboarding@resend.dev` |
| `FRONTEND_URL` | Frontend origin for CORS | — |

---

## Product Management

Products are managed via `public/products.csv` — no code changes required.

### How to Update Products

1. Open `public/products.csv` in Excel or Google Sheets
2. Edit prices, descriptions, allergen info, or add new rows
3. Save the file
4. Hard refresh the website (Ctrl+Shift+R)

### CSV Columns

| Column | Description |
|--------|-------------|
| `id` | Unique product ID |
| `name` | Product display name |
| `slug` | URL-friendly name (auto-generated from name) |
| `price` | Retail price |
| `imageUrl` | Path to product image (e.g., `/images/cakes/Cake.png`) |
| `category` | One of: `onebite`, `cakes`, `personal-desserts`, `pastries`, `bread`, `bakery-shelf` |
| `description` | Product description |
| `allergenFree` | e.g., `Gluten Free, Dairy Free, Nut Free` |
| `allergens` | e.g., `has Dairy, has Nuts, has Gluten, has Eggs` |

---

## Deployment

This project deploys as two services on Railway:

### Frontend
- **Branch:** `main` (auto-deploys on push)
- **Build:** `npm install && npm run build`
- **Serve:** `npx serve dist -s -l $PORT`
- **Config:** `railway.json` (root)

### Backend
- **Build:** Nixpacks (auto-detected)
- **Start:** `npm start`
- **Health check:** `/api/health`
- **Config:** `backend/railway.json`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Service status |
| `GET` | `/api/health` | Health check with timestamp |
| `POST` | `/api/contact` | Contact form submission (validates and sends email via Resend) |

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing page with hero, favourites carousel, visit us section |
| `/menu` | Menu | Full product catalog with scrollspy category tabs |
| `/contact` | Contact | Contact form with validation |
| `/products` | Products | Product catalog grid view |
| `/product/:slug` | Product Detail | Individual product with description, allergens, pricing |

---

## Developed By

<div align="center">

### [Kim Consultant](https://www.kimconsultant.net/)

**Websites and Systems for Toronto Small Businesses**

We build modern, high-performance websites and digital solutions tailored for small businesses. From elegant storefronts to complete business systems, we help Toronto businesses establish a powerful online presence.

[![Website](https://img.shields.io/badge/Visit-kimconsultant.net-0066cc?style=for-the-badge)](https://www.kimconsultant.net/)

[**Get in Touch**](https://www.kimconsultant.net/)

</div>

---

## License

This project is proprietary software developed for Lumière Pâtisserie.

Copyright © 2025–2026 Lumière Pâtisserie. All rights reserved.

Website developed by [Kim Consultant](https://www.kimconsultant.net/)
