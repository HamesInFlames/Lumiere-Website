// src/models/Product.js
import mongoose from "mongoose";
import slugify from "slugify";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true }, // e.g. "/Fraisier.png"
    category: {
      type: String,
      required: true,
      enum: ["cakes", "personal-desserts", "onebite", "pastries", "bread", "bakery-shelf"]
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

ProductSchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Product", ProductSchema);
