import { Schema, model } from "mongoose";
import IProduct from "../utils/types";

const ProductSchema = new Schema<IProduct>({
  ProductID: { type: Number, required: true, unique: true },
  ProductName: { type: String, required: true, trim: true },
  Category: { type: String, required: true, trim: true },
  Price: { type: Number, required: true },
});

/* ProductSchema.virtual("total_sales", {
  ref: "Sale",
  localField: "ProductID",
  foreignField: "ProductID",
  justOne: false
}) */

ProductSchema.index({ ProductID: 1, Category: 1 })

const Product = model<IProduct>("Product", ProductSchema);

module.exports = Product;
