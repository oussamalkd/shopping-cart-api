const Sale = require("../models/Sales");

import ISale from "../utils/types";

const { useImportData } = require("../utils/useImportData");

const fillCollection = async (req: any, res: any) => {
  const count = await Sale.find().countDocuments();

  if (count === 0) {
    useImportData("sales", Sale);
  }
};

module.exports = { fillCollection };
