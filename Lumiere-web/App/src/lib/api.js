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
      (p.name ? p.name.toLowerCase().replace(/\s+/g, "-") : "") ||
      p.id ||
      "";

    // make sure images array is always an array
    let images = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      images = p.images;
    } else if (p.imageUrl) {
      images = [p.imageUrl];
    } else if (p.image) {
      images = [p.image];
    }

    // Get primary image - prioritize imageUrl from backend (backend uses imageUrl, not image)
    const primaryImage = p.imageUrl || images[0] || p.image || null;

    return {
      id: p.id ?? p._id ?? slug,
      slug,
      title: p.title ?? p.name ?? "",
      price:
        typeof p.price === "number"
          ? p.price
          : Number(p.price ?? 0),

      // primary image (first image in array or imageUrl)
      image: primaryImage,
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

/**
 * Submit a pre-order
 */
export async function submitOrder(orderData) {
  const r = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...orderData,
      orderSource: "website",
    }),
  });

  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit order");
  }

  return r.json();
}

/**
 * Track order status by order number
 */
export async function trackOrder(orderNumber) {
  const r = await fetch(`${API}/orders/track/${orderNumber}`);
  if (!r.ok) throw new Error("Order not found");
  return r.json();
}
