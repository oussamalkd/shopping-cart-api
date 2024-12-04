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
  { timestamps: true }
);

SalesSchema.index({ ProductID: 1})

const Sale = model<ISale>("Sale", SalesSchema);

module.exports = Sale;
