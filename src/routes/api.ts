import express, { Request, Response } from "express";
import {
  create as cHero,
  update as uHero,
  remove as delHero,
} from "../controllers/HeroController";
import {
  create as cPartner,
  update as uPartner,
  remove as delPartner,
} from "../controllers/PartnerController";
import {
  create as cProd,
  update as uProd,
  remove as delProd,
} from "../controllers/ProductsController";
import {
  create as cService,
  update as uService,
  remove as delService,
} from "../controllers/servicesController";
import {
  create as cTestimony,
  update as uTestimony,
  remove as delTestimony,
} from "../controllers/TestimonyController";
import { isAuthenticated } from "../middleware/authMiddleware";
import {
  create as cPorto,
  remove as delPorto,
  update as uPorto,
} from "../controllers/PortofolioController";
const PrivateRoutes = express.Router();

if (process.env.AUTH_ENABLED == "true") {
  PrivateRoutes.use(isAuthenticated);
}
// HERO
PrivateRoutes.post("/hero/:id", cHero);
PrivateRoutes.post("/hero", (req: Request, res: Response) => {
  return res.status(418).json({
    message: "Please input ID or position ('left' or 'right') in params",
  });
});
PrivateRoutes.route("/hero/:id").patch(uHero);
PrivateRoutes.route("/hero/:id").delete(delHero);

// PARTNER
PrivateRoutes.post("/partner", cPartner);
PrivateRoutes.route("/partner/:id").patch(uPartner);
PrivateRoutes.route("/partner/:id").delete(delPartner);

// PRODUCT
PrivateRoutes.post("/product", cProd);
PrivateRoutes.route("/product/:id").patch(uProd);
PrivateRoutes.route("/product/:id").delete(delProd);

// SERVICES
PrivateRoutes.post("/service", cService);
PrivateRoutes.route("/service/:id").patch(uService);
PrivateRoutes.route("/service/:id").delete(delService);
// TESTIMONY
PrivateRoutes.post("/testimony", cTestimony);
PrivateRoutes.route("/testimony/:id").patch(uTestimony);
PrivateRoutes.route("/testimony/:id").delete(delTestimony);

PrivateRoutes.post("/portofolio", cPorto);
PrivateRoutes.route("/portofolio/:id").patch(uPorto);
PrivateRoutes.route("/portofolio/:id").delete(delPorto);

export default PrivateRoutes;
