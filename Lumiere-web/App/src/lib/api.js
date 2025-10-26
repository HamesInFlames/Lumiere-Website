// App/src/lib/api.js
const API = "/api";

function normalizeList(data) {
  const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  return arr.map(p => ({
    // accept either backend-style or your current front-end field names
    id: p.id ?? p._id ?? p.slug ?? p.title,
    slug: p.slug ?? p.id ?? "",
    title: p.title ?? p.name ?? "",
    price: typeof p.price === "number" ? p.price : Number(p.price ?? 0),
    image: p.image ?? p.imageUrl ?? null,
    images: Array.isArray(p.images) ? p.images : (p.imageUrl ? [p.imageUrl] : (p.image ? [p.image] : [])),
    category: p.category ?? "",
    // pass through extra fields if present
    description: p.description,
    ingredients: p.ingredients,
    allergens: p.allergens,
    serving_size: p.serving_size
  }));
}

export async function fetchProducts({ category, q } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);

  const r = await fetch(`${API}/products?${params.toString()}`);
  if (!r.ok) throw new Error("Failed");
  const data = await r.json();
  return normalizeList(data);
}

export async function fetchProduct(slug) {
  const r = await fetch(`${API}/products/${slug}`);
  if (!r.ok) throw new Error("Not found");
  const p = await r.json();
  return normalizeList([p])[0]; // normalize single item
}
