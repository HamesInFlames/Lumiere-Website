// src/config/db.js
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.warn("⚠️  MONGODB_URI not set; continuing without DB connection");
    console.warn("   Set MONGODB_URI in .env file to enable database features");
    // Disable buffering so queries fail fast instead of hanging
    mongoose.set("bufferCommands", false);
    return;
  }
  
  // Clean up URI (remove any line breaks or extra whitespace)
  const cleanUri = uri.trim().replace(/\s+/g, '');
  
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(cleanUri, { 
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });
    console.log("✅ MongoDB connected successfully");
    console.log(`   Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("   Common issues:");
    console.error("   1. Check MongoDB Atlas IP whitelist (Network Access)");
    console.error("   2. Verify username/password in connection string");
    console.error("   3. Ensure connection string is on one line in .env");
    console.error("   4. Check internet connection");
    mongoose.set("bufferCommands", false);
  }
}

export async function disconnectDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("🛑 MongoDB disconnected");
    }
  } catch (err) {
    console.error("❌ MongoDB disconnect error:", err.message);
  }
}
