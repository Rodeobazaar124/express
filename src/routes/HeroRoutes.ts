import express from "express";
import { create, get, remove, update } from "../controllers/HeroController";
// import { authMiddleware } from "../middleware/auth-middleware";

const HeroRoutes = express.Router();
// ProductsRoutes.use(authMiddleware);

// GET
HeroRoutes.route("/").get(get);
HeroRoutes.route("/:id/").get(get);
HeroRoutes.route("/:position/").get(get);
// HeroRoutes.route("/:position/:id/").get(get);

// // CREATE
HeroRoutes.post("/:id", create);

// // UPDATE
HeroRoutes.route("/:id").patch(update);

// // DELETE
HeroRoutes.route("/:id").delete(remove);

export default HeroRoutes;
