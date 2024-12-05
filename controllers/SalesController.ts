const Sale = require("../models/Sales");

import { ServerResponse } from "http";
import ISale from "../utils/types";

const { useImportData } = require("../utils/useImportData");

const fillCollection = async (req: any, res: any) => {
  const count = await Sale.find().countDocuments();

  if (count === 0) {
    useImportData("sales", Sale);
  }
};


// #GET api/analytics/total_sales
const getTotalSales = async (last_days: number = 0) => {

  let filters: Record<string,unknown> = {}

  if(last_days) {
    const today = new Date()
    const daysPeriod = new Date(today)
    daysPeriod.setDate(today.getDate() - last_days )
    filters.Date = { $gte: daysPeriod }
  }
  
  const sales = await Sale.aggregate([
    {
      $match: filters
    },
    {
      $group: {
        _id: null,
        totalSalesAmount: { $sum: "$TotalAmount" }
      }
    },
    {
      $project: {
        _id: 0,
        totalSalesAmount: 1,
      }
    },
  ])

  return sales
}


// #GET api/analytics/trending_products
const getTrandingProducts = async (req:any, res:ServerResponse) => {
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
        TotalSalesAmount: { $multiply: ['$Price', '$TotalSales']}
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


// GET /analytics/category_sales
const getSalesByCategory = async (req:any, res:ServerResponse) => {
  const sales = await Sale.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "ProductID",
        foreignField: "ProductID",
        as: "Product"
      }
    },
    {
      $unwind: "$Product"
    },
    {
      $group: {
        _id: "$Product.Category",
        TotalCategorySales: { $sum: 1}

      }
    },
    {
      $lookup: {
        from: "sales",
        pipeline: [{
          $count: "total"
        }],
        as: "TotalSales"
      }
    },
    {
      $unwind: "$TotalSales"
    },
    {
      $addFields: {
        percentage: { $multiply: [{$divide: ["$TotalCategorySales", "$TotalSales.total"]},100]}
      }
    },
  ])

  return res.end(JSON.stringify({ secess: true, sales }))
}

module.exports = { fillCollection, getTotalSales, getTrandingProducts, getSalesByCategory };
