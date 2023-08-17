import express, { response } from "express";
import { create, remove, get, update } from "../controllers/servicesController";
// import { authMiddleware } from "../middleware/auth-middleware";

const servicesRoutes = express.Router();

// GET
servicesRoutes.route("/").get(get);
servicesRoutes.route("/:id").get(get);

// CREATE
// servicesRoutes.use(authMiddleware);
servicesRoutes.post("/", create);

// update
servicesRoutes.route("/:id").patch(update);

// DELETE
servicesRoutes.route("/:id").delete(remove);

export default servicesRoutes;
