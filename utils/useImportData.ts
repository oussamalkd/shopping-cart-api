import { Model } from "mongoose";
const csvtojson = require("csvtojson");

const useImportData = async (fileName: string, model: Model<any>) => {
  const file = `${__dirname}/../dataset/${fileName}.csv`;

  let data: Array<any> = [];

  const jsonArray = await csvtojson().fromFile(file);

  jsonArray.forEach((row: IProduct) => data.push(row));

  await model.insertMany(data);
};

module.exports = { useImportData };
