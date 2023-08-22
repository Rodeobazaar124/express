import { Router } from "express";

import { get as getHero } from "../controllers/HeroController";
import { get as getPartner } from "../controllers/PartnerController";
import { get as getServices } from "../controllers/servicesController";
import { get as getTestimony } from "../controllers/TestimonyController";
import { get as getProducts } from "../controllers/ProductsController";
import { get as getPortofolio } from "../controllers/PortofolioController";

const Routes = Router();

// HERO
Routes.route("/hero/").get(getHero);
Routes.route("/hero/:id/").get(getHero);
Routes.route("/hero/:position/").get(getHero);

// PARTNER
Routes.route("/partner/").get(getPartner);
Routes.route("/partner/:id").get(getPartner);

// SERVICES
Routes.route("/service/").get(getServices);
Routes.route("/service/:id").get(getServices);

// TESTIMONY
Routes.route("/testimony/").get(getTestimony);
Routes.route("/testimony/:id").get(getTestimony);

// PRODUCT
Routes.route("/product/").get(getProducts);
Routes.route("/product/:id").get(getProducts);

// PRODUCT
Routes.route("/portofolio/").get(getPortofolio);
Routes.route("/portofolio/:id").get(getPortofolio);

export default Routes;
