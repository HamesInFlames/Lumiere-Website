# Lumière Pâtisserie Website - Project Context

> **Use this document to onboard any AI assistant to the codebase.**
> Last updated: March 28, 2026

---

## Quick Summary

**Lumière Pâtisserie** is a French patisserie in Thornhill, Ontario, Canada. This is their production website deployed via **Railway** (auto-deploys from `main` branch).

| Aspect | Details |
|--------|---------|
| **Tech Stack** | React 19 + Vite 7, React Router 7, CSS (no modules), Swiper.js |
| **Deployment** | Railway (connected to `main` branch) |
| **Backend** | Serverless - contact form uses Google Apps Script |
| **Product Data** | CSV file at `public/products.csv` (no database) |
| **Branch Strategy** | `development` for work, `main` for production |

---

## Project Structure

```
Lumiere-Website/
├── src/                      # ⭐ MAIN FRONTEND CODE
│   ├── App.jsx               # Root component with routing
│   ├── main.jsx              # Entry point
│   ├── styles.css            # Global styles
│   ├── components/
│   │   ├── Header.jsx        # Navigation with hamburger menu
│   │   ├── Footer.jsx        # Contact info, social links
│   │   ├── FavouritesCarousel.jsx  # Swiper carousel of random products
│   │   ├── ShowcaseImage.jsx # Full-width image component
│   │   ├── VisitUs.jsx       # Store location section
│   │   └── ScrollToTop.jsx   # Scroll restoration on route change
│   ├── pages/
│   │   ├── Home.jsx          # Landing page with hero, sections
│   │   ├── Menu.jsx          # Full menu with category tabs
│   │   ├── Contact.jsx       # Contact form + Google Maps
│   │   └── Products/
│   │       ├── index.jsx     # Products listing (unused, redirects to Menu)
│   │       └── Product.jsx   # Individual product detail page
│   ├── lib/
│   │   ├── api.js            # Product fetching (CSV parsing, normalization)
│   │   └── imageMap.js       # Maps original images to optimized WebP versions
│   └── styles/               # Component-specific CSS files
│       ├── Header.css
│       ├── Footer.css
│       ├── Home.css
│       ├── Menu.css
│       ├── Contact.css
│       ├── Product.css
│       ├── VisitUs.css
│       └── Collection.css
│
├── public/
│   ├── products.csv          # ⭐ PRODUCT DATA (edit here for prices/descriptions)
│   ├── images/               # Original product images (organized by category)
│   │   ├── cakes/
│   │   ├── personal-desserts/
│   │   ├── one-biters/
│   │   ├── pastries/
│   │   ├── breads/
│   │   ├── bakery-shelf/
│   │   └── web-design/       # Logo, hero image, Uber Eats logo
│   └── optimized/            # WebP versions (auto-generated, used in production)
│
├── backend/                  # Minimal Express server (mostly unused)
│   └── server.js             # Basic health check endpoint
│
├── Lumiere-web/              # ⚠️ LEGACY - Old project structure (can be ignored)
│   ├── App/                  # Old frontend (duplicate of src/)
│   └── Backend/              # Old backend with MongoDB models
│
├── scripts/
│   └── optimize-images.js    # Sharp script to convert images to WebP
│
├── index.html                # Vite entry HTML
├── vite.config.js            # Vite configuration (port 8000)
├── package.json              # Dependencies
├── railway.json              # Railway deployment config
├── CHANGELOG.md              # History of all changes
├── ROADMAP.md                # Future plans (Staff App, Inventory, etc.)
└── README.md                 # Basic project info
```

---

## Key Files to Know

### 1. Product Data (`public/products.csv`)

Products are managed via CSV - no code changes needed for updates:

```csv
id,name,slug,price,imageUrl,category,description,allergenFree,allergens
3,ChocoHazelnut Cake,chocohazelnut-cake,56,/images/cakes/ChocoHazelnut Cake.png,cakes,"Milk Chocolate Cremeux, Dark Chocolate Mousse, Hazelnut Crunch",,"has Dairy, has Nut, has Gluten"
```

**Categories**: `onebite`, `cakes`, `personal-desserts`, `pastries`, `bread`, `bakery-shelf`, `hidden`

### 2. API Layer (`src/lib/api.js`)

- Fetches and parses `products.csv`
- Normalizes product data (consistent field names)
- Maps images to optimized WebP versions
- Includes fallback hardcoded data if CSV fails

### 3. Routing (`src/App.jsx`)

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/menu" element={<Menu />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/product/:slug" element={<ProductPage />} />
  <Route path="*" element={<Home />} />  {/* Fallback */}
</Routes>
```

### 4. Contact Form (`src/pages/Contact.jsx`)

Sends to Google Apps Script (no backend needed):
```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw.../exec";
```

---

## Styling Approach

- **Global styles**: `src/styles.css` (home page, base resets)
- **Component styles**: `src/styles/*.css` (one file per component/page)
- **No CSS modules** - uses regular class names
- **Rainbow gradient accent**: Used in header underline, buttons, accents
- **Font**: Inter (system fallback), Filson Pro for headings

---

## Current Features

### Home Page
- Full-width hero with CTA button
- 3-column product category cards (Cakes, Personal Desserts, One-Bite)
- "Illuminate a moment" gift section
- Favourites Carousel (random products, Swiper.js)
- Showcase image
- Visit Us section

### Menu Page
- Sticky horizontal category tabs with scrollspy
- Rainbow gradient on active tab
- Mobile scroll indicators (arrows + fade)
- Product grid with images, prices, descriptions
- Links to individual product pages

### Product Page
- Image gallery with thumbnails (main + sliced view)
- Accordion sections: Description, Allergen Info, Ingredients
- Allergen-free items shown in green, allergens in red

### Contact Page
- Contact form (name, email, phone, message)
- Business hours
- Embedded Google Maps
- Phone number link

### Header
- Logo (centered)
- Navigation: Home, Menu, Contact Us
- Uber Eats button (desktop right, mobile left)
- Hamburger menu for mobile
- Rainbow underline on hover/active

### Footer
- Social links (Facebook, Instagram)
- Quick links (Menu, Contact)
- Phone number, address
- Copyright

---

## Business Information

| Detail | Value |
|--------|-------|
| **Name** | Lumière Pâtisserie |
| **Address** | 1102 Centre St #1, Thornhill, ON L4J 3M8 |
| **Phone** | (647) 293-8815 |
| **Email** | eliran@lumierepatisserie.ca |
| **Hours** | Tue-Sun 9am-7pm, Closed Monday |
| **Instagram** | @lumierepatisserie.to |
| **Facebook** | /Lumierepatisserietoronto |
| **Uber Eats** | Available for delivery |

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (port 8000)
npm run dev

# Build for production
npm run build

# Optimize images (converts to WebP)
npm run optimize-images

# Lint code
npm run lint
```

---

## Deployment

- **Platform**: Railway
- **Branch**: `main` (auto-deploys on push)
- **URL**: Connected to custom domain

**Workflow**:
1. Work on `development` branch
2. Test locally with `npm run dev`
3. Merge to `main` when ready
4. Railway auto-deploys

---

## Future Roadmap (Planned)

See `ROADMAP.md` for full details:

1. **Staff Application** (React Native + Expo)
   - Team chat (replace WhatsApp)
   - Pre-order management
   - Wholesale orders
   - Calendar view
   - Role-based access (Owner, Kitchen, Bar)

2. **Inventory System**
   - Track stock levels
   - Low stock alerts

3. **Checkout System**
   - Online pre-orders
   - Payment integration (Stripe)

4. **Gift Cards & Membership**
   - Digital gift cards
   - Loyalty points

---

## Known Issues / TODOs

- Legacy `Lumiere-web/` folder can be cleaned up
- Some products missing images (show placeholder)
- SEO meta tags need improvement

---

## Tips for AI Assistants

1. **Product changes**: Edit `public/products.csv`, not code
2. **Styling**: Check component-specific CSS in `src/styles/`
3. **Images**: Use optimized WebP from `public/optimized/`
4. **Testing**: Run `npm run dev` on port 8000
5. **Don't touch**: `main` branch directly - use `development`
6. **Contact form**: Uses Google Apps Script, not backend

---

## Dependencies

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.8.0",
  "swiper": "^11.2.10"
}
```

Dev dependencies: Vite 7, ESLint, Sharp (image optimization)
