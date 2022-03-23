const mongoose = require("mongoose");
const dbUri = process.env.DB_URI;

const connectMongo = () => {
  mongoose
    .connect(dbUri)
    .then(() => console.log("db connected.."))
    .catch((err) => console.log("db connection error-->", err));
};

module.exports = connectMongo;
