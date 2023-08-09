import express, { response } from "express";
import { create, remove, get, update } from "../controllers/servicesController";
// import { authMiddleware } from "../middleware/auth-middleware";

const ProductsRoutes = express.Router();
// ProductsRoutes.use(authMiddleware);

// GET
ProductsRoutes.route("/").get(get);
ProductsRoutes.route("/:id").get(get);

// CREATE
ProductsRoutes.post("/", create);

// UPDATE
ProductsRoutes.route("/:id").put(update);

// DELETE
ProductsRoutes.route("/:id").delete(remove);

export default ProductsRoutes;
