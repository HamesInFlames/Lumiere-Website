// src/controllers/productController.js
import mongoose from "mongoose";
import Product from "../models/Product.js";
import samples from "../products/productSamples.js";

const toClient = (p) => ({
  id: p._id ? p._id.toString() : p.id,
  name: p.name,
  price: p.price,
  imageUrl: p.imageUrl,
  slug: p.slug,
  category: p.category,

  // 🔥 FIX: send all extra fields to frontend
  description: p.description ?? "",
  ingredients: p.ingredients ?? "",
  allergens: p.allergens ?? "",
  serving_size: p.serving_size ?? "",

  // 🔥 Fix image arrays - check for non-empty array first
  images: Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : p.imageUrl
    ? [p.imageUrl]
    : []
});


function filterSortPaginate(list, { category, q, sort = "name", page = 1, limit = 50 }) {
  let items = [...list];
  if (category) items = items.filter(x => x.category === category);
  if (q) items = items.filter(x => x.name.toLowerCase().includes(String(q).toLowerCase()));
  const desc = String(sort).startsWith("-");
  const key = String(sort).replace(/^-/, "");
  items.sort((a, b) => {
    const A = key === "price" ? (a.price ?? 0) : String(a[key] ?? "");
    const B = key === "price" ? (b.price ?? 0) : String(b[key] ?? "");
    return A > B ? 1 : A < B ? -1 : 0;
  });
  if (desc) items.reverse();

  const pageNum = Math.max(1, parseInt(page));
  const perPage = Math.max(1, Math.min(200, parseInt(limit)));
  const start = (pageNum - 1) * perPage;
  const sliced = items.slice(start, start + perPage);

  return { items: sliced.map(toClient), total: items.length, page: pageNum, pages: Math.ceil(items.length / perPage) };
}

export async function listProducts(req, res, next) {
  try {
    const connected = mongoose.connection.readyState === 1;
    if (!connected) {
      return res.json(filterSortPaginate(samples, req.query));
    }

    const { category, q, sort = "name", page = 1, limit = 50 } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: "i" };

    const sortObj = {};
    if (sort) {
      const key = String(sort).replace(/^-/, "");
      sortObj[key] = String(sort).startsWith("-") ? -1 : 1;
    }

    const pageNum = Math.max(1, parseInt(page));
    const perPage = Math.max(1, Math.min(200, parseInt(limit)));

    const [docs, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip((pageNum - 1) * perPage).limit(perPage).lean(),
      Product.countDocuments(filter)
    ]);

    res.json({ items: docs.map(toClient), total, page: pageNum, pages: Math.ceil(total / perPage) });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { idOrSlug } = req.params;
    const connected = mongoose.connection.readyState === 1;

    // DEV MODE — USE SAMPLES
    if (!connected) {
      const found = samples.find(
        p => p.slug === idOrSlug || p.id === idOrSlug
      );
      if (!found) return res.status(404).json({ message: "Product not found" });
      return res.json(toClient(found));
    }

    // DATABASE MODE
    const byId = /^[a-f\d]{24}$/i.test(idOrSlug) ? { _id: idOrSlug } : null;
    const prod = await Product.findOne(byId || { slug: idOrSlug }).lean();
    if (!prod) return res.status(404).json({ message: "Product not found" });

    return res.json(toClient(prod));
  } catch (err) {
    next(err);
  }
}


// (Optional) dev/admin CRUD:
export async function createProduct(req, res, next) {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(toClient(created));
  } catch (err) { next(err); }
}
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const upd = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!upd) return res.status(404).json({ message: "Product not found" });
    res.json(toClient(upd));
  } catch (err) { next(err); }
}
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const del = await Product.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ message: "Product not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
}
