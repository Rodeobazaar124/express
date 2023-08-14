import express from "express";
import { create, remove, get, update } from "../controllers/PartnerController";
// import { authMiddleware } from "../middleware/auth-middleware";

const PartnerRoutes = express.Router();
// ProductsRoutes.use(authMiddleware);

// GET
PartnerRoutes.route("/").get(get);
PartnerRoutes.route("/:id").get(get);

// CREATE
PartnerRoutes.post("/", create);

// UPDATE
PartnerRoutes.route("/:id").put(update);

// DELETE
PartnerRoutes.route("/:id").delete(remove);

export default PartnerRoutes;
