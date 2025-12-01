// src/models/Product.js
import mongoose from "mongoose";
import slugify from "slugify";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true }, // e.g. "/Fraisier.png"
    images: [{ type: String }], // additional product images
    category: {
      type: String,
      required: true,
      enum: ["cakes", "personal-desserts", "onebite", "pastries", "bread"]
    },
    description: { type: String, default: "" },
    ingredients: { type: String, default: "" },
    allergens: { type: String, default: "" },
    serving_size: { type: String, default: "" },
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
