// src/models/SignupKey.js
// Special passwords/keys required for worker signup
import mongoose from "mongoose";

const SignupKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["pastry_chef", "barista"],
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    maxUsage: {
      type: Number,
      default: null, // null = unlimited
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      default: null, // null = never expires
    },
  },
  { timestamps: true }
);

// Check if key is valid
SignupKeySchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  if (this.maxUsage !== null && this.usageCount >= this.maxUsage) return false;
  return true;
};

export default mongoose.model("SignupKey", SignupKeySchema);

