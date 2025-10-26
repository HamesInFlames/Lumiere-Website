// src/seed/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../src/config/db.js";       // ✅ correct path
import Product from "../src/models/Product.js";    // ✅ correct path
import samples from "../src/products/productSamples.js";

(async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    const docs = await Product.insertMany(samples.map(({ id, ...p }) => p));
    console.log(`✅ Seeded ${docs.length} products`);
  } catch (e) {
    console.error("Seed error", e);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
})();
