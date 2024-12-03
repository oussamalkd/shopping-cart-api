require("dotenv").config();
const http = require("http");

const products = require("./controllers/productsController");

//setup routing
const server = http.createServer((req: any, res: any) => {
  res.writeHead(200, { "Content-Type": "text/json" });

  const url = req.url;

  if (url === "/") {
    res.write("documentation route");
    res.end();
  }
  if (url === "/products") {
    products(req, res);
    res.end();
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
server.listen(port, () => {
  start();
  console.log(`Your app runing at http://localhost:${port}`);
});
