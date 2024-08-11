import {
  createProduct,
  getProduct,
  getSingleProduct,
  getNewArrivals,
  updateProduct,
  deleteProduct,
  getRecommended,
} from "../controller/product.js";
import upload from "../middleware/multer.js";
import authenticate from "../middleware/authenticate.js";
import express from "express";

const productRouter = express.Router();
productRouter.post("/", authenticate, upload.single("image"), createProduct);
productRouter.get("/", getProduct);
productRouter.get("/:id", getSingleProduct);
productRouter.get("/newArrivals", getNewArrivals);
productRouter.get("/recommendation/:userId", getRecommended);
productRouter.patch("/:id", upload.single("image"), updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
