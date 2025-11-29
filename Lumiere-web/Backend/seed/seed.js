// seed/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "../src/config/db.js";
import Product from "../src/models/Product.js";
import samples from "../src/products/productSamples.js";

dotenv.config();

(async () => {
  try {
    await connectDB();
    
    // Wait for connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }
    
    console.log('Connected to database');
    
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
