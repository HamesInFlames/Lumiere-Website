// src/lib/usePageMeta.js
// Keeps <title>, meta tags, canonical and JSON-LD in sync on SPA navigation.
// Uses the same selectors / ids that scripts/prerender.js writes, so nothing
// is duplicated once JS takes over from the prerendered HTML.
import { useEffect } from "react";

function upsert(selector, tag, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

export function usePageMeta(meta, jsonLd) {
  const ld = jsonLd ? JSON.stringify(jsonLd).replace(/</g, "\\u003c") : null;
  const { title, description, canonical, image } = meta || {};

  useEffect(() => {
    if (!title) return;
    document.title = title;

    upsert('meta[name="description"]', "meta", { name: "description", content: description });
    upsert('link[rel="canonical"]', "link", { rel: "canonical", href: canonical });
    upsert('meta[property="og:title"]', "meta", { property: "og:title", content: title });
    upsert('meta[property="og:description"]', "meta", { property: "og:description", content: description });
    upsert('meta[property="og:url"]', "meta", { property: "og:url", content: canonical });
    upsert('meta[property="og:image"]', "meta", { property: "og:image", content: image });
    upsert('meta[property="og:type"]', "meta", {
      property: "og:type",
      content: /\/product\//.test(canonical || "") ? "product" : "website",
    });
    upsert('meta[name="twitter:card"]', "meta", { name: "twitter:card", content: "summary_large_image" });

    const existing = document.head.querySelector("script#page-jsonld");
    if (ld) {
      const script = existing || document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-jsonld";
      script.textContent = ld;
      if (!existing) document.head.appendChild(script);
    } else if (existing) {
      existing.remove();
    }
  }, [title, description, canonical, image, ld]);
}
