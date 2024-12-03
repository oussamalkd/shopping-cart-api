const Product = require("../models/Products");

const index = async (req: any, res: any) => {
  const products = await Product.find();
  return res.write({ sucess: true, products });
};

module.exports = index;
