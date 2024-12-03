const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectDB = (url: string): Promise<string> => {
  return mongoose.connect(url);
};

module.exports = connectDB;
