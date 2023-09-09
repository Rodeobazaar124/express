/*
 Ini adalah Route protected, semua aksi disini memerlukan autentikasi (bila fitur autentikasi di aktifkan) 
 */

import express, { Request, Response } from "express";
import range from "../controllers/RangeController";
import hero from "../controllers/HeroController";
import partner from "../controllers/PartnerController";
import product from "../controllers/ProductController";
import service from "../controllers/serviceController";
import testimony from "../controllers/TestimonyController";
import porto from "../controllers/PortofolioController";
import { isAuthenticated } from "../middleware/authMiddleware";
const PrivateRoutes = express.Router();


// Cek apakah fitur autentikasi dihidupkan dari env
if (process.env.AUTH_ENABLED == "true") {
  PrivateRoutes.use(isAuthenticated);
}
// HERO
PrivateRoutes.route("/hero(/:id)?")
  .patch(hero.update)
  .post(hero.create)
  .delete(hero.remove);

// PARTNER
PrivateRoutes.route("/partner(/:id)?")
  .patch(partner.update)
  .post(partner.create)
  .delete(partner.remove);

// PRODUCT
PrivateRoutes.route("/product(/:id)?")
  .post(product.create)
  .patch(product.update)
  .delete(product.remove);

// SERVICES
PrivateRoutes.route("/service(/:id)?")
  .post(service.create)
  .patch(service.update)
  .delete(service.remove);

// TESTIMONY
PrivateRoutes.route("/testimony(/:id)?")
  .post(testimony.create)
  .patch(testimony.update)
  .delete(testimony.remove);

PrivateRoutes.route("/portofolio(/:id)?")
  .post(porto.create)
  .patch(porto.update)
  .delete(porto.remove);

// NOIU IN RANGE
PrivateRoutes.route("/range(/:slug)?")
  .post(range.create)
  .patch(range.update)
  .delete(range.remove);
export default PrivateRoutes;
