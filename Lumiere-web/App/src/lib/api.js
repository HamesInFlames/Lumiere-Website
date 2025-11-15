// App/src/lib/api.js

const API = "/api";

/**
 * Normalizes product objects coming from the backend so the frontend
 * always receives consistent field names.
 */
function normalizeList(data) {
  const arr =
    Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
      ? data.items
      : [];

  return arr.map((p) => {
    // ensure slug always exists (fallback to id or title)
    const slug =
      p.slug ||
      (p.title ? p.title.toLowerCase().replace(/\s+/g, "-") : "") ||
      p.id ||
      "";

    // make sure images array is always an array
    let images = [];
    if (Array.isArray(p.images)) {
      images = p.images;
    } else if (p.imageUrl) {
      images = [p.imageUrl];
    } else if (p.image) {
      images = [p.image];
    }

    return {
      id: p.id ?? p._id ?? slug,
      slug,
      title: p.title ?? p.name ?? "",
      price:
        typeof p.price === "number"
          ? p.price
          : Number(p.price ?? 0),

      // primary image (first image in array)
      image: images[0] || null,
      images,

      category: p.category ?? "",

      // important fields for product detail page
      description: p.description ?? "",       // <— ensure blank string instead of undefined
      ingredients: p.ingredients ?? "",
      allergens: p.allergens ?? "",
      serving_size: p.serving_size ?? "",
    };
  });
}

/**
 * Fetch list of products with optional filtering:
 * - category
 * - q (search)
 */
export async function fetchProducts({ category, q } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);

  const r = await fetch(`${API}/products?${params.toString()}`);
  if (!r.ok) throw new Error("Failed to load products");

  const data = await r.json();
  return normalizeList(data);
}

/**
 * Fetch a single product using its slug.
 */
export async function fetchProduct(slug) {
  const r = await fetch(`${API}/products/${slug}`);
  if (!r.ok) throw new Error("Product not found");

  const p = await r.json();
  return normalizeList([p])[0]; // return normalized single item
}
