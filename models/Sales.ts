import { Schema, model } from "mongoose";
import ISale from "../utils/types";

const SalesSchema = new Schema<ISale>(
  {
    SaleID: { type: Number, required: true, unique: true },
    ProductID: { type: Number, required: true },
    Quantity: { type: Number, required: true },
    Date: { type: Date, required: true },
    TotalAmount: { type: Number, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

SalesSchema.index({ ProductID: 1})

/* SalesSchema.virtual("product", {
  ref: "Product",
  localField: "ProductID",
  foreignField: "ProductID",
  justOne: false
}) */

const Sale = model<ISale>("Sale", SalesSchema);

module.exports = Sale;
