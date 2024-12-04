const Sale = require("../models/Sales");

import ISale from "../utils/types";

const { useImportData } = require("../utils/useImportData");

const fillCollection = async (req: any, res: any) => {
  const count = await Sale.find().countDocuments();

  if (count === 0) {
    useImportData("sales", Sale);
  }
};

// #GET api/analytics/trending_products
const getTrandingProducts = async (req:any, res:any) => {
  const products = await Sale.aggregate([
    // group products by total sales
    {
      $group: {
        _id: "$ProductID",
        TotalSales: { $sum: '$Quantity'},
      },
    },
    // get product details from Products collection
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "ProductID",
        as: "Product"
      }
    },
    // Deconstructs result from array to object
    {
      $unwind: "$Product"
    },
    // get needed fields
    {
      $project: {
        ProductID: "$_id",
        ProductName: "$Product.ProductName",
        Price: "$Product.Price",
        TotalSales: 1,
      }
    },
    // add total amount field
    {
      $addFields: {
        TotalAmount: { $multiply: ['$Price', '$TotalSales']}
      }
    },
    // remove unused fields
    {
      $unset: "Price"
    },
    // sort by best selling product
    {
      $sort: { TotalSales: -1 }
    },
    // get top 3
    {
      $limit: 3
    }
  ])
  return res.end(JSON.stringify({secess: true, products}))
}

module.exports = { fillCollection, getTrandingProducts };
