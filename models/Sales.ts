import { Schema, model } from "mongoose";
import ISale from "../utils/types";

const ProductSchema = new Schema<ISale>(
  {
    SaleID: { type: Number, required: true, unique: true },
    ProductID: { type: Number, required: true },
    Quantity: { type: Number, required: true },
    Date: { type: Date, required: true },
    TotalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Sale = model<ISale>("Sale", ProductSchema);

module.exports = Sale;
