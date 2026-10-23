// src/lib/seo.js
// Shared SEO data + helpers. Pure JS: no DOM / browser APIs, so it can be
// imported by the browser bundle AND by scripts/prerender.js under plain Node.

export const SITE_URL = "https://www.lumierepatisserie.ca";

export const BUSINESS = {
  name: "Lumière Pâtisserie",
  phone: "+1-647-293-8815",
  phoneDisplay: "(647) 293-8815",
  email: "contact@lumierepatisserie.ca", // from public/llms.txt
  address: {
    street: "1102 Centre St #1",
    city: "Thornhill",
    region: "ON",
    postalCode: "L4J 3M8",
    country: "CA",
  },
  geo: { latitude: 43.8089956, longitude: -79.4618227 },
  sameAs: [
    "https://www.instagram.com/lumierepatisserie.to",
    "https://www.facebook.com/Lumierepatisserietoronto/",
    "https://www.yelp.ca/biz/lumiere-patisserie-thornhill",
    "https://www.tripadvisor.ca/Restaurant_Review-g983899-d25265171-Reviews-Lumiere_Patisserie-Thornhill_Vaughan_Ontario.html",
  ],
};

export const ADDRESS_LINE = "1102 Centre St #1, Thornhill, ON L4J 3M8";

// Matches src/pages/Contact.jsx: Monday closed, Tuesday-Sunday 9am - 7pm.
export const HOURS = [
  { day: "Monday", closed: true },
  { day: "Tuesday", text: "9am - 7pm" },
  { day: "Wednesday", text: "9am - 7pm" },
  { day: "Thursday", text: "9am - 7pm" },
  { day: "Friday", text: "9am - 7pm" },
  { day: "Saturday", text: "9am - 7pm" },
  { day: "Sunday", text: "9am - 7pm" },
];

// Same ids / labels / order as MENU_SECTIONS in src/pages/Menu.jsx.
// Products with category "hidden" are not shown anywhere.
export const CATEGORIES = [
  { id: "cakes", label: "Cakes", blurb: "Whole cakes for gatherings, birthdays, and special occasions." },
  { id: "personal-desserts", label: "Personal Desserts", blurb: "Individual-sized treats, perfect for gifting or a moment for yourself." },
  { id: "onebite", label: "One-Bite Creations", blurb: "Elegant petit fours and bite-sized sweets for sharing." },
  { id: "pastries", label: "Pastries", blurb: "Classic French viennoiserie, baked fresh every morning." },
  { id: "bread", label: "Breads", blurb: "Artisan sourdough and specialty loaves." },
  { id: "bakery-shelf", label: "Bakery Shelf", blurb: "Cookies, bars, and shelf-stable treats." },
];

export const DEFAULT_IMAGE = "/optimized/images/web-design/Hero desserts.webp";

export function categoryLabel(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : null;
}

/** Join SITE_URL + path; encodeURI so paths with spaces / & / accents work. */
export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return encodeURI(path);
  const p = path.startsWith("/") ? path : `/${path}`;
  return encodeURI(`${SITE_URL}${p}`);
}

export function formatPrice(price) {
  return `$${Number(price || 0).toFixed(2)}`;
}

/** Cut text longer than max chars at a word boundary, appending an ellipsis. */
export function truncate(text, max = 160) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.\-–—]+$/, "")}…`;
}

const STATIC_META = {
  home: {
    title: "Lumière Pâtisserie | French Pastry, Bakery & Café in Thornhill",
    description:
      "Modern French pâtisserie, artisan bakery and espresso bar at 1102 Centre St, Thornhill (Vaughan). Croissants, personal desserts, cakes, sourdough and coffee.",
    path: "/",
    image: DEFAULT_IMAGE,
  },
  menu: {
    title: "Menu: Cakes, Pastries, Croissants & Sourdough | Lumière Pâtisserie",
    description:
      "Browse the Lumière Pâtisserie menu: whole cakes, personal French desserts, one-bite assortments, croissants and Danishes, sourdough breads and bakery-shelf treats. Thornhill, ON.",
    path: "/menu",
    image: DEFAULT_IMAGE,
  },
  contact: {
    title: "Contact & Hours | Lumière Pâtisserie, Thornhill",
    description:
      "Visit Lumière Pâtisserie at 1102 Centre St #1, Thornhill, ON. Open Tuesday to Sunday, 9am–7pm; closed Monday. Call (647) 293-8815.",
    path: "/contact",
    image: DEFAULT_IMAGE,
  },
};

/**
 * Page meta for a route.
 * @param {"home"|"menu"|"contact"|"product"} route
 * @param {object} [product] normalized product (title, slug, price, description, image)
 * @returns {{title:string, description:string, canonical:string, image:string}}
 */
export function pageMeta(route, product) {
  if (route === "product" && product) {
    const name = product.title || product.name || "";
    const price = formatPrice(product.price);
    let description;
    if (product.description) {
      let d = truncate(product.description, 160);
      if (!/[.!?…]$/.test(d)) d += ".";
      description = `${d} ${price} at Lumière Pâtisserie, Thornhill.`;
    } else {
      description = `${name}, ${price}, from Lumière Pâtisserie, a French pâtisserie and bakery at 1102 Centre St, Thornhill, ON.`;
    }
    return {
      title: `${name} | Lumière Pâtisserie, Thornhill`,
      description,
      canonical: absoluteUrl(`/product/${product.slug}`),
      image: absoluteUrl(product.image || DEFAULT_IMAGE),
    };
  }
  const m = STATIC_META[route] || STATIC_META.home;
  return {
    title: m.title,
    description: m.description,
    canonical: absoluteUrl(m.path),
    image: absoluteUrl(m.image),
  };
}

/** schema.org Bakery JSON-LD. */
export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: BUSINESS.name,
    url: SITE_URL,
    image: absoluteUrl(DEFAULT_IMAGE),
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    servesCuisine: ["French", "Pastry"],
    priceRange: "$$",
    hasMenu: absoluteUrl("/menu"),
    sameAs: BUSINESS.sameAs,
  };
}

/** schema.org Product JSON-LD (no availability, no ratings). */
export function productJsonLd(p) {
  const url = absoluteUrl(`/product/${p.slug}`);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title || p.name,
  };
  if (p.description) ld.description = p.description;
  // Structured-data images must show the product, so no generic fallback here.
  if (p.image) ld.image = absoluteUrl(p.image);
  ld.url = url;
  ld.brand = { "@type": "Brand", name: BUSINESS.name };
  ld.offers = {
    "@type": "Offer",
    price: Number(p.price || 0).toFixed(2),
    priceCurrency: "CAD",
    url,
  };
  return ld;
}
