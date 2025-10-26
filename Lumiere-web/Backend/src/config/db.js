// src/config/db.js
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("⚠️  MONGO_URI not set; continuing without DB connection");
    // Disable buffering so queries fail fast instead of hanging
    mongoose.set("bufferCommands", false);
    return;
  }
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
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
