// scripts/prerender.js
// Post-build step (runs after `vite build`): writes one static HTML file per
// real route from the built dist/index.html template, with route-specific
// <head> tags and a plain-HTML snapshot inside <div id="root">.
// main.jsx uses createRoot().render(), which replaces the snapshot when JS runs,
// so the snapshot only mirrors content the React pages already show.
//
// Also writes dist/sitemap.xml and dist/serve.json (redirects + rewrites).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCSV, normalizeProduct } from "../src/lib/api.js";
import {
  SITE_URL,
  BUSINESS,
  ADDRESS_LINE,
  HOURS,
  CATEGORIES,
  absoluteUrl,
  categoryLabel,
  formatPrice,
  pageMeta,
  businessJsonLd,
  productJsonLd,
} from "../src/lib/seo.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const TEMPLATE_PATH = path.join(DIST, "index.html");
const CSV_PATH = path.join(ROOT, "public", "products.csv");

// ---------------------------------------------------------------- helpers

const escapeHtml = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** JSON for a <script type="application/ld+json"> block; `<` is escaped. */
const jsonForScript = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

const imgSrc = (p) => escapeHtml(encodeURI(p));

function writeFileEnsured(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

// ------------------------------------------------------------------- data

if (!fs.existsSync(TEMPLATE_PATH)) {
  throw new Error(`prerender: ${TEMPLATE_PATH} not found. Run \`vite build\` first.`);
}
const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
if (!template.includes("<title>") || !template.includes("</head>") || !template.includes('<div id="root"></div>')) {
  throw new Error('prerender: dist/index.html is missing <title>, </head> or <div id="root"></div>.');
}

const csvText = fs.readFileSync(CSV_PATH, "utf8");
const products = parseCSV(csvText)
  .map(normalizeProduct)
  .filter((p) => p.category !== "hidden" && p.slug);

// ------------------------------------------------------------- head + shell

function headTags(meta, jsonLd, ogType) {
  const tags = [
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(meta.image)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (jsonLd) {
    tags.push(`<script type="application/ld+json" id="page-jsonld">${jsonForScript(jsonLd)}</script>`);
  }
  return tags.map((t) => `    ${t}`).join("\n") + "\n";
}

function renderPage({ meta, jsonLd, ogType = "website", body }) {
  let html = template.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace("</head>", () => `${headTags(meta, jsonLd, ogType)}</head>`);
  html = html.replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
  return html;
}

const navHtml = `<header>
<nav aria-label="Main">
<a href="/">Home</a>
<a href="/menu">Menu</a>
<a href="/contact">Contact Us</a>
</nav>
</header>`;

const footerHtml = `<footer>
<p>${escapeHtml(BUSINESS.name)}, ${escapeHtml(ADDRESS_LINE)}. <a href="tel:${escapeHtml(BUSINESS.phone.replace(/-/g, ""))}">${escapeHtml(BUSINESS.phoneDisplay)}</a></p>
</footer>`;

const shell = (main) => `${navHtml}
<main>
${main}
</main>
${footerHtml}`;

// ------------------------------------------------------------------- pages

// Mirrors src/pages/Home.jsx (hero H1, "Pastries" cards, "Illuminate a moment").
function homeBody() {
  return shell(`<section>
<h1>Artfully Crafted, Made for Sharing</h1>
<p><a href="/menu">BROWSE MENU</a></p>
</section>
<section>
<h2>Pastries</h2>
<ul>
<li><a href="/menu#cakes">Cakes</a></li>
<li><a href="/menu#personal-desserts">Personal Desserts</a></li>
<li><a href="/menu#onebite">One-Bite Assortments</a></li>
</ul>
</section>
<section>
<h2>Illuminate a moment</h2>
<p>Immerse yourself in the artistry of taste and embark on a journey of unparalleled pleasure</p>
<p><a href="/menu">SEE OUR MENU</a></p>
</section>`);
}

// Mirrors src/pages/Menu.jsx: H1 "Menu", subtitle, then sections that have items.
function menuBody() {
  const sections = CATEGORIES.map((cat) => {
    const list = products.filter((p) => p.category === cat.id);
    if (!list.length) return "";
    const items = list
      .map((p) => {
        const desc = p.description ? `<br />${escapeHtml(p.description)}` : "";
        return `<li><a href="/product/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a> ${escapeHtml(formatPrice(p.price))}${desc}</li>`;
      })
      .join("\n");
    return `<section id="${escapeHtml(cat.id)}">
<h2>${escapeHtml(cat.label)}</h2>
<p>${escapeHtml(cat.blurb)}</p>
<ul>
${items}
</ul>
</section>`;
  }).filter(Boolean);

  return shell(`<h1>Menu</h1>
<p>Explore our cakes, pastries, breads, and one-bite creations — crafted fresh at Lumière Patisserie.</p>
${sections.join("\n")}`);
}

// Mirrors src/pages/Contact.jsx (title, lede, phone, address, hours).
function contactBody() {
  const hours = HOURS.map(
    (h) => `<li><span>${escapeHtml(h.day)}</span> <em>${h.closed ? "Closed" : escapeHtml(h.text)}</em></li>`
  ).join("\n");
  return shell(`<h1>Contact Us</h1>
<p>Questions about custom orders, pickup &amp; delivery, or anything else? We'd love to help.</p>
<h2>Get in touch</h2>
<p>Phone: <a href="tel:${escapeHtml(BUSINESS.phone.replace(/-/g, ""))}">${escapeHtml(BUSINESS.phoneDisplay)}</a></p>
<p>Address: ${escapeHtml(ADDRESS_LINE)}</p>
<h3>Hours</h3>
<ul>
${hours}
</ul>`);
}

// Mirrors src/pages/Products/Product.jsx.
function productBody(p) {
  const label = categoryLabel(p.category);
  const crumbs = [
    `<li><a href="/">Home</a></li>`,
    `<li><a href="/menu">Menu</a></li>`,
    label ? `<li><a href="/menu#${escapeHtml(p.category)}">${escapeHtml(label)}</a></li>` : "",
    `<li aria-current="page">${escapeHtml(p.title)}</li>`,
  ]
    .filter(Boolean)
    .join("\n");

  const parts = [];
  if (p.image) parts.push(`<img src="${imgSrc(p.image)}" alt="${escapeHtml(p.title)}" />`);
  parts.push(`<h1>${escapeHtml(p.title)}</h1>`);
  parts.push(`<p>${escapeHtml(formatPrice(p.price))}</p>`);
  if (p.description) parts.push(`<h2>Description</h2>\n<p>${escapeHtml(p.description)}</p>`);
  if (p.allergens || p.allergenFree) {
    const lines = [];
    if (p.allergenFree) lines.push(`<p><strong>Free From:</strong> ${escapeHtml(p.allergenFree.replace(/ Free/gi, ""))}</p>`);
    if (p.allergens) lines.push(`<p><strong>Contains:</strong> ${escapeHtml(p.allergens.replace(/has /gi, ""))}</p>`);
    parts.push(`<h2>Allergen Information</h2>\n${lines.join("\n")}`);
  }
  if (p.ingredients) parts.push(`<h2>Ingredients</h2>\n<p>${escapeHtml(p.ingredients)}</p>`);
  if (p.serving_size) parts.push(`<h2>Serving Size</h2>\n<p>${escapeHtml(p.serving_size)}</p>`);

  return shell(`<nav aria-label="Breadcrumb">
<ol>
${crumbs}
</ol>
</nav>
<article>
${parts.join("\n")}
</article>`);
}

// ------------------------------------------------------------ write routes

// The home page is written to dist/_home.html, not dist/index.html: under
// `serve -s` dist/index.html is returned for EVERY extensionless URL, so it must
// stay the neutral template (no canonical, og:url, JSON-LD or snapshot) or every
// page would claim to be a duplicate of `/`. Without -s, `/` is rewritten to
// /_home.html below.
const outputs = []; // { urlPath, file, html }
outputs.push({
  urlPath: "/",
  file: path.join(DIST, "_home.html"),
  html: renderPage({ meta: pageMeta("home"), jsonLd: businessJsonLd(), body: homeBody() }),
});
outputs.push({
  urlPath: "/menu",
  file: path.join(DIST, "menu", "index.html"),
  html: renderPage({ meta: pageMeta("menu"), jsonLd: null, body: menuBody() }),
});
outputs.push({
  urlPath: "/contact",
  file: path.join(DIST, "contact", "index.html"),
  html: renderPage({ meta: pageMeta("contact"), jsonLd: businessJsonLd(), body: contactBody() }),
});
for (const p of products) {
  outputs.push({
    urlPath: `/product/${p.slug}`,
    file: path.join(DIST, "product", p.slug, "index.html"),
    html: renderPage({
      meta: pageMeta("product", p),
      jsonLd: productJsonLd(p),
      ogType: "product",
      body: productBody(p),
    }),
  });
}
for (const o of outputs) writeFileEnsured(o.file, o.html);

// Neutral SPA shell (no canonical / snapshot) for serve's 404 handling when
// serve runs without -s: unknown URLs return a real 404 status but still boot
// the React app (which renders Home for unknown routes).
writeFileEnsured(path.join(DIST, "404.html"), template);

// ----------------------------------------------------------------- sitemap

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  outputs.map((o) => `  <url><loc>${escapeHtml(absoluteUrl(o.urlPath))}</loc></url>`).join("\n") +
  `\n</urlset>\n`;
writeFileEnsured(path.join(DIST, "sitemap.xml"), sitemap);

// ---------------------------------------------------------------- serve.json
// Redirects are evaluated before everything else, first match wins
// (specific before general).
const redirect = (source, destination) => ({ source, destination, type: 301 });
const redirects = [
  redirect("/collections/gateaux-cakes", "/menu#cakes"),
  redirect("/collections/cakes", "/menu#cakes"),
  redirect("/collections/petit-gateaux-personal-desserts", "/menu#personal-desserts"),
  redirect("/collections/boulangerie", "/menu#bread"),
  redirect("/collections/viennoiserie", "/menu#pastries"),
  redirect("/collections/petit-fours", "/menu#onebite"),
  redirect("/collections/one-biters", "/menu#onebite"),
  redirect("/collections/bakery-shelf", "/menu#bakery-shelf"),
];
for (const p of products) {
  redirects.push(redirect(`/collections/:collection/products/${p.slug}`, `/product/${p.slug}`));
  redirects.push(redirect(`/products/${p.slug}`, `/product/${p.slug}`));
}
redirects.push(
  // serve drops the query string, so /products?category=x lands on /menu
  // (the old client-side redirect kept the category as a #hash).
  redirect("/products", "/menu"),
  redirect("/products/**", "/menu"),
  // NFC tag target is /drinks-menu.html; keep the extensionless form working.
  redirect("/drinks-menu", "/drinks-menu.html"),
  redirect("/collections", "/menu"),
  redirect("/collections/**", "/menu"),
  redirect("/pages/contact", "/contact"),
  redirect("/pages/about", "/"),
  redirect("/password", "/")
);

// Rewrites map each prerendered clean URL to its static file.
// NOTE 1: `serve -s` prepends its own `** -> /index.html` rewrite ahead of these,
//   which shadows them, so with the current Railway start command (`serve dist -s`)
//   every extensionless URL still gets dist/index.html. They only take effect when
//   serve is started WITHOUT -s. Redirects and cleanUrls:false work either way.
// NOTE 2: serve-handler chains rewrites (each match's output is fed through the
//   remaining rules), so a trailing `** -> /index.html` would override these. Do
//   NOT add a catch-all here; unknown URLs fall through to dist/404.html instead.
const rewrites = [
  { source: "/", destination: "/_home.html" },
  { source: "/menu", destination: "/menu/index.html" },
  { source: "/contact", destination: "/contact/index.html" },
  { source: "/product/:slug", destination: "/product/:slug/index.html" },
];

// cleanUrls:false so static .html files (e.g. /drinks-menu.html, the NFC target)
// are served as-is instead of 301ing to an extensionless URL that the SPA
// fallback then swallows. directoryListing:false so folders such as /assets/ or
// /product/ never render a file listing.
const serveConfig = { cleanUrls: false, directoryListing: false, redirects, rewrites };
writeFileEnsured(path.join(DIST, "serve.json"), JSON.stringify(serveConfig, null, 2) + "\n");

console.log(
  `prerender: ${outputs.length} pages (${products.length} products), ` +
    `${outputs.length} sitemap URLs, ${redirects.length} redirects -> ${SITE_URL}`
);
