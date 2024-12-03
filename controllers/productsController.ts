const Product = require("../models/Products");

import IProduct from "../utils/types";

const { useImportData } = require("../utils/useImportData");

const index = async (req: any, res: any) => {
  const products = await Product.find();
  return res.end(JSON.stringify({ sucess: true, products }));
};

const fillCollection = async () => {
  const count = await Product.find().countDocuments();

  if (count === 0) {
    useImportData("products", Product);
  }
};

module.exports = { index, fillCollection };
