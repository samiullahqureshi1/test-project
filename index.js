import express from "express";
import dotenv from "dotenv";
import { dbConnection } from "./connections/db_Connection.js";
import Router from "./routes/router.js";

dotenv.config();
const app = express();
dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/banner", Router.banner);
app.use("/auth", Router.auth);
app.use("/uploads", express.static("./uploads"));
app.use("/product", Router.product);
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
