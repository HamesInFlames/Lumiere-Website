# Changelog

All notable changes to the Lumière Patisserie website will be documented in this file.

---

## [2026-03-10] - Menu Navigation & Infrastructure Updates

### ✨ New Features

#### Menu Page Enhancements
- **Rainbow gradient active tab** — Active category tab now features a beautiful rainbow gradient matching the site's header theme
- **Improved scrollspy** — Smoother, more accurate section highlighting as you scroll through the menu
- **Mobile scroll indicators** — Arrow buttons and fade gradients on mobile to indicate horizontally scrollable tabs
- **Spring-like animations** — Enhanced tab transitions with natural, bouncy easing

#### Favourites Carousel
- Carousel cards are now fully clickable for better UX
- Added proper scrollbar spacing

### 🔧 Technical Improvements

#### Contact Form
- Migrated from backend API to Google Apps Script for form submissions
- Simplified deployment by removing backend dependency

#### Codebase Cleanup
- Fixed broken image references
- Removed unused files and components
- Reorganized configuration files
- Added `.nvmrc` for Node 20 version specification

#### Deployment
- Added Railway deployment configuration
- Reorganized image assets for better structure

---

## [2026-02-09] - Product Data & UI Updates

### Products Updated
- **All prices updated** to retail prices from the master spreadsheet
- **Description and allergen fields separated** - now displayed in distinct accordion sections

### New Products Added
#### Cakes
- Chocolate Cream & Crumb Cake ($44)
- Quite Daisy ($56)

#### Personal Desserts
- Chocolate Cream & Crumb ($10)
- Matcha Latte ($11.50)

#### Breads
- Japanese Milk Bread ($6.50)

#### Bakery Shelf
- Choco Chip & Hazelnut Cookies ($9.75)
- Oatmeal Cookies ($9.75)
- Black Sesame Choco Chip ($9.75)
- Halva Cookies ($9.75)
- Pecan Tart ($25)
- Chocolate Nemesis ($25)
- Meringues ($6.75)
- Lumiere Marshmallows ($10.50)
- Hazelnut Dacquoise Square ($12)
- Biscotti ($9.75)
- Crinkle Cookie ($3.50)
- Hazelnut Cookie ($4)
- Sweetheart ($4)

### Products Removed
- Pecan Salted Caramel Danish
- Pear Breton
- All Crostinis
- Drinks category
- Add-ons category

### Breads Filtered
Only the following breads are now shown:
- Tartine ($7)
- Rye & Walnut ($7.50)
- Whole Wheat & Seeds ($7.50)
- Tomato & Garlic ($7.50)
- Greek Olive ($7.50)
- Japanese Milk Bread ($6.50)

### UI/UX Improvements
- **Product page accordion** now uses +/- icons instead of arrows
- **Allergen Information** displayed in a separate collapsible section
  - Allergen-free items shown in green
  - Allergens/contains shown in red
- Improved mobile responsiveness for product details

### Contact Form
- Contact form emails now sent to `eliran@lumierepatisserie.ca`

### Data Management
- Products can now be edited via `public/products.csv`
- CSV includes separate columns for `description`, `allergenFree`, and `allergens`

---

## How to Edit Products

1. Open `public/products.csv` in Excel or Google Sheets
2. Edit prices, descriptions, or allergen info
3. Save the file
4. Refresh the website (hard refresh: Ctrl+Shift+R)

### CSV Columns
| Column | Description |
|--------|-------------|
| id | Unique product ID |
| name | Product display name |
| slug | URL-friendly name (auto-generated from name) |
| price | Retail price |
| imageUrl | Path to product image |
| category | One of: onebite, cakes, personal-desserts, pastries, bread, bakery-shelf |
| description | Product description |
| allergenFree | e.g., "Gluten Free, Dairy Free, Nut Free" |
| allergens | e.g., "has Dairy, has Nuts, has Gluten, has Eggs" |
