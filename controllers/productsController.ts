const Product = require("../models/Products");
const Sale = require("../models/Sales")

import IProduct from "../utils/types";

const { useImportData } = require("../utils/useImportData");

const index = async (req: any, res: any): Promise<IProduct> => {
  const products = await Sale.aggregate([
    {
      $group: {
        _id: "$ProductID",
        TotalSales: { $sum: '$Quantity'}
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "ProductID",
        as: "details"
      }
    },
    // Deconstructs result from array to object
    {
      $unwind: "$details"
    },
    // get needed fields
    {
      $project: {
        ProductID: "$_id",
        ProductName: "$details.ProductName",
        Category: "$details.Category",
        Price: "$details.Price",
        TotalSales: 1
      }
    },
    // sort products with the most sale
    {
      $sort: { TotalSales: -1}
    }
  ])
  //const products = await Product.find({ProductID: 1}).populate("total_sales");
  return res.end(JSON.stringify({ sucess: true, products }));
};

const fillCollection = async () => {
  const count = await Product.find().countDocuments();

  if (count === 0) {
    useImportData("products", Product);
  }
};

module.exports = { index, fillCollection };
