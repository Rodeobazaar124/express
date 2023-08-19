import { Router } from "express";

import { get as getHero} from "../controllers/HeroController";
import { get as getPartner } from "../controllers/PartnerController";
import { get as getServices } from "../controllers/servicesController";
import { get as getTestimony } from "../controllers/TestimonyController";


const Routes = Router();

// HERO
Routes.route("/hero/").get(getHero);
Routes.route("/hero/:id/").get(getHero);
Routes.route("/hero/:position/").get(getHero);

// PARTNER
Routes.route("/partner/").get(getPartner);
Routes.route("/partner/:id").get(getPartner);

// SERVICES
Routes.route("/partner/").get(getServices);
Routes.route("/partner/:id").get(getServices);

// TESTIMONY
Routes.route("/testimony/").get(getTestimony);
Routes.route("/testimony/:id").get(getTestimony);

// PRODUCT
Routes.route("/product/").get(getTestimony);
Routes.route("/product/:id").get(getTestimony);

export default Routes;
