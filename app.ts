import { ServerResponse } from "http";

require("dotenv").config();
const http = require("http");

const productController = require("./controllers/productsController");
const salesController = require("./controllers/SalesController");

//setup routing
const server = http.createServer((req: any, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  const url = req.url;

  if (url === "/") {
    res.write("documentation route");
    res.end();
  }
  if (url === "/api/products") {
    productController.index(req, res);
  }

  if(url === "/api/analytics/trending_products") {
    salesController.getTrandingProducts(req, res)
  }

  if(url === "/api/analytics/category_sales") {
    salesController.getSalesByCategory(req, res)
  }
});

//connect databae
const connection = require("./db/connect");

const start = async () => {
  try {
    await connection(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
};

const port = process.env.PORT || 5000;

//start server after success connection
server.listen(port, (req: any, res: ServerResponse) => {
  //start connection
  start();
  // insert data to product collection
  productController.fillCollection();
  // insert data to sales collection
  salesController.fillCollection();

  console.log(`Your app runing at http://localhost:${port}`);
});
