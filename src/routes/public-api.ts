import { Router } from "express";

import range from "../controllers/RangeController";
import hero from "../controllers/HeroController";
import partner from "../controllers/PartnerController";
import service from "../controllers/serviceController";
import testimony from "../controllers/TestimonyController";
import product from "../controllers/ProductController";
import porto from "../controllers/PortofolioController";

const Routes = Router();

// HERO
Routes.route("/hero(/:id)?").get(hero.get);
// PARTNER
Routes.route("/partner(/:id)?").get(partner.get);
// SERVICES
Routes.route("/service(/:id)?").get(service.get);
// TESTIMONY
Routes.route("/testimony(/:id)?").get(testimony.get);
// PRODUCT
Routes.route("/product(/:id)?").get(product.get);
// PORTOFOLIO
Routes.route("/portofolio(/:id)?").get(porto.get);
// NOIU IN RANGE
Routes.route("/range(/:slug)").get(range.get);

export default Routes;
