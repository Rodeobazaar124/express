import express, { response } from "express";
import {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/ProductsController";
const ProductsRoutes = express.Router();

ProductsRoutes.route("/").get(getProduct);
ProductsRoutes.post("/create", createProduct);
ProductsRoutes.route("/update/:id").put(updateProduct);
ProductsRoutes.route("/delete/:id").delete(deleteProduct);

export default ProductsRoutes;
