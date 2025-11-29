// src/models/Inventory.js
import mongoose from "mongoose";

const InventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["pastry", "barista", "shared"],
      index: true,
    },
    unit: {
      type: String,
      required: true,
      // e.g., "kg", "liters", "pieces", "boxes", "cartons"
    },
    currentQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    minimumQuantity: {
      type: Number,
      default: 0,
      // Alert when stock falls below this
    },
    maximumQuantity: {
      type: Number,
      default: null,
      // Recommended maximum stock level
    },
    lastRestocked: {
      type: Date,
    },
    restockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Track low stock
InventoryItemSchema.virtual("isLowStock").get(function () {
  return this.currentQuantity <= this.minimumQuantity;
});

InventoryItemSchema.set("toJSON", { virtuals: true });
InventoryItemSchema.set("toObject", { virtuals: true });

export default mongoose.model("InventoryItem", InventoryItemSchema);

