const Product = require("../models/Products");
const Sale = require("../models/Sales");

import { ServerResponse } from "http";
import IProduct from "../utils/types";

const { useImportData } = require("../utils/useImportData");

// #GET api/products
const index = async (page: number = 1): Promise<IProduct> => {
  const products = await Sale.aggregate([
    // group products by total sales
    {
      $group: {
        _id: "$ProductID",
        TotalSales: { $sum: "$Quantity" },
      },
    },
    // get product details from Products collection
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "ProductID",
        as: "details",
      },
    },
    // Deconstructs result from array to object
    {
      $unwind: "$details",
    },
    // get needed fields
    {
      $project: {
        ProductID: "$_id",
        ProductName: "$details.ProductName",
        Category: "$details.Category",
        Price: "$details.Price",
        TotalSales: 1,
      },
    },
    // sort by best selling product
    {
      $sort: { TotalSales: -1 },
    },

    // handle pagination. default 10 per page
    { $skip: (page - 1) * 10 },
    { $limit: 10 },
  ]);

  return products;
};

// fill products collection
const fillCollection = async () => {
  const count = await Product.find().countDocuments();

  if (count === 0) {
    useImportData("products", Product);
  }
};

module.exports = { index, fillCollection };
