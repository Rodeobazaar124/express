import express from "express";
import {
  create,
  remove,
  get,
  update,
} from "../controllers/TestimonyController";
// import { authMiddleware } from "../middleware/auth-middleware";

const TestimonyRoutes = express.Router();
// ProductsRoutes.use(authMiddleware);

// GET
TestimonyRoutes.route("/").get(get);
TestimonyRoutes.route("/:id").get(get);

// CREATE
TestimonyRoutes.post("/", create);

// UPDATE
TestimonyRoutes.route("/:id").patch(update);

// DELETE
TestimonyRoutes.route("/:id").delete(remove);

export default TestimonyRoutes;
