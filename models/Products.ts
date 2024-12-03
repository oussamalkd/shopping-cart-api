import { Schema, model } from "mongoose";

const ProductSchema = new Schema<Product>({
  product_id: { type: Number, required: true, unique: true },
  product_name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
});

const Product = model<Product>("Product", ProductSchema);

module.exports = Product;
