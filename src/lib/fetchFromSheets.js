// Fetch product data from Google Sheets
// 
// HOW TO SET UP:
// 1. Create a Google Sheet with these columns:
//    id | name | price | imageUrl | category | description
//
// 2. Go to File → Share → Publish to web
//    - Choose "Entire Document" and "CSV"
//    - Click "Publish" and copy the link
//
// 3. Replace SHEET_URL below with your published CSV link
//
// 4. Your sheet should look like this:
//    | id | name                  | price | imageUrl                              | category          | description                                    |
//    | 1  | Tiramisu Cake         | 50    | /Lumiere/Cake/Tiramisu Cake.png       | cakes             | Tiramisu Mousse, Coffee Syrup...               |
//    | 2  | Sweet Pleasure        | 11.5  | /Lumiere/Personal Desserts/Sweet...   | personal-desserts | Dark Chocolate Mousse...                       |

import { getOptimizedImage } from './imageMap.js';

// Replace this with your published Google Sheet CSV URL
// Format: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv
const SHEET_URL = null; // Set to null to use local data instead

/**
 * Parse CSV text into array of objects
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const products = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const product = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      // Convert price to number
      if (header === 'price') {
        value = parseFloat(value) || 0;
      }
      product[header] = value;
    });
    
    // Generate slug if not provided
    if (!product.slug && product.name) {
      product.slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    products.push(product);
  }
  
  return products;
}

/**
 * Parse a single CSV line, handling quoted values with commas
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
}

/**
 * Normalize product for frontend use
 */
function normalizeProduct(p) {
  const optimizedImage = getOptimizedImage(p.imageUrl);
  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
    image: optimizedImage,
    images: [optimizedImage],
    category: p.category,
    description: p.description || '',
  };
}

/**
 * Fetch products from Google Sheets
 */
export async function fetchProductsFromSheets() {
  if (!SHEET_URL) {
    console.warn('No Google Sheet URL configured. Using local data.');
    return null;
  }
  
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error('Failed to fetch sheet');
    
    const csvText = await response.text();
    const products = parseCSV(csvText);
    
    return products.map(normalizeProduct);
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return null;
  }
}

/**
 * Cache for sheet data (5 minutes)
 */
let cachedProducts = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getProducts() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedProducts && (now - cacheTime) < CACHE_DURATION) {
    return cachedProducts;
  }
  
  // Try to fetch from sheets
  const sheetProducts = await fetchProductsFromSheets();
  
  if (sheetProducts) {
    cachedProducts = sheetProducts;
    cacheTime = now;
    return sheetProducts;
  }
  
  // Fallback to local data
  return null;
}




