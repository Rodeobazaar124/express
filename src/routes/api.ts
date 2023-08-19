import express, { Request, Response } from "express";
import { create as cHero, update as uHero, remove as delHero } from "../controllers/HeroController";
import { create as cPartner, update as uPartner, remove as delPartner } from "../controllers/PartnerController";
import { create as cProd, update as uProd, remove as delProd } from "../controllers/ProductsController";
import { create as cService, update as uService, remove as delService } from "../controllers/servicesController";
import { create as cTestimony, update as uTestimony, remove as delTestimony } from "../controllers/TestimonyController";
const PrivateRoutes = express.Router();


// HERO
PrivateRoutes.post("/:id", cHero);
PrivateRoutes.post("/", (req: Request, res: Response) => {
    return res.status(418).json({
        message: "Please input ID or position ('left' or 'right') in params",
    });
});
PrivateRoutes.route("/:id").patch(uHero);
PrivateRoutes.route("/:id").delete(delHero);

// PARTNER
PrivateRoutes.post("/", cPartner);
PrivateRoutes.route("/:id").patch(uPartner);
PrivateRoutes.route("/:id").delete(delPartner);

// PRODUCT
PrivateRoutes.post("/", cProd);
PrivateRoutes.route("/:id").patch(uProd);
PrivateRoutes.route("/:id").delete(delProd);

// SERVICES
PrivateRoutes.post("/", cService);
PrivateRoutes.route("/:id").patch(uService);
PrivateRoutes.route("/:id").delete(delService);
// TESTIMONY
PrivateRoutes.post("/", cTestimony);
PrivateRoutes.route("/:id").patch(uTestimony);
PrivateRoutes.route("/:id").delete(delTestimony);

export default PrivateRoutes;
