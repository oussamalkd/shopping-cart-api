import { ServerResponse } from "http";

require("dotenv").config();
const http = require("http");
const urlParser = require("url");

const productController = require("./controllers/productsController");
const salesController = require("./controllers/SalesController");

//setup routing
const server = http.createServer(async (req: any, res: ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Max-Age", 2592000); // 30 days
  res.writeHead(200, { "Content-Type": "application/json" });

  const url = req.url;
  const parsedUrl = urlParser.parse(url, true);

  if (parsedUrl.pathname === "/") {
    res.write("documentation route");
    res.end();
  } else if (parsedUrl.pathname === "/api/products") {
    const page = parsedUrl.query.page;
    const products = await productController.index(page);
    return res.end(JSON.stringify({ success: true, products }));
  } else if (parsedUrl.pathname === "/api/analytics/total_sales") {
    const analytics = await salesController.getTotalSales(
      parsedUrl.query.last_days
    );

    if (analytics.length === 0) {
      return res.end(
        JSON.stringify({
          secess: true,
          message: "There are no sales in selected period",
        })
      );
    }

    return res.end(JSON.stringify({ success: true, analytics }));
  } else if (parsedUrl.pathname === "/api/analytics/trending_products") {
    salesController.getTrandingProducts(req, res);
  } else if (parsedUrl.pathname === "/api/analytics/category_sales") {
    salesController.getSalesByCategory(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
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
