const Product = require("../models/Products");
const csvtojson = require("csvtojson");

import IProduct from "../utils/types";

const { useImportData } = require("../utils/useImportData");

const index = async (req: any, res: any) => {
  const products = await Product.find();
  return res.end(JSON.stringify({ sucess: true, products }));
};

/* const fillData = async () => {
  const file = `${__dirname}/../dataset/products.csv`;
  let productsData: Array<IProduct> = [];
  const jsonArray = await csvtojson().fromFile(file);
  jsonArray.forEach((row: IProduct) => productsData.push(row));
  await Product.insertMany(productsData);
}; */
const fillCollection = async (req: any, res: any) => {
  const count = await Product.find().countDocuments();

  if (count === 0) {
    useImportData("products", Product);
  }
};

module.exports = { index, fillCollection };
