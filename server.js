require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { createServer } = require("http");
const connectMongo = require("./utils/connectMongo");
const socketInit = require("./utils/socket");

const PORT = process.env.PORT;

const app = express();
app.use(cookieParser());
app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

const server = createServer(app);

socketInit(server);
connectMongo();
server.listen(PORT, () => {
  console.log(`server is running on port - ${PORT}`);
});
