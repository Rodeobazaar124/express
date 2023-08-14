import express, { Request, Response } from "express";
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
HeroRoutes.post("/", (req: Request, res: Response) => {
  return res.status(418).json({
    message: "I'm a teapot! Please input ID in params",
  });
});

// // UPDATE
HeroRoutes.route("/:id").patch(update);

// // DELETE
HeroRoutes.route("/:id").delete(remove);

export default HeroRoutes;
