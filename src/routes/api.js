"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var HeroController_1 = require("../controllers/HeroController");
var PartnerController_1 = require("../controllers/PartnerController");
var ProductsController_1 = require("../controllers/ProductsController");
var servicesController_1 = require("../controllers/servicesController");
var TestimonyController_1 = require("../controllers/TestimonyController");
var PortofolioController_1 = require("../controllers/PortofolioController");
var PrivateRoutes = express_1.default.Router();
// PrivateRoutes.use(isAuthenticated);
// HERO
PrivateRoutes.post("/hero/:id", HeroController_1.create);
PrivateRoutes.post("/hero", function (req, res) {
    return res.status(418).json({
        message: "Please input ID or position ('left' or 'right') in params",
    });
});
PrivateRoutes.route("/hero/:id").patch(HeroController_1.update);
PrivateRoutes.route("/hero/:id").delete(HeroController_1.remove);
// PARTNER
PrivateRoutes.post("/partner", PartnerController_1.create);
PrivateRoutes.route("/partner/:id").patch(PartnerController_1.update);
PrivateRoutes.route("/partner/:id").delete(PartnerController_1.remove);
// PRODUCT
PrivateRoutes.post("/product", ProductsController_1.create);
PrivateRoutes.route("/product/:id").patch(ProductsController_1.update);
PrivateRoutes.route("/product/:id").delete(ProductsController_1.remove);
// SERVICES
PrivateRoutes.post("/service", servicesController_1.create);
PrivateRoutes.route("/service/:id").patch(servicesController_1.update);
PrivateRoutes.route("/service/:id").delete(servicesController_1.remove);
// TESTIMONY
PrivateRoutes.post("/testimony", TestimonyController_1.create);
PrivateRoutes.route("/testimony/:id").patch(TestimonyController_1.update);
PrivateRoutes.route("/testimony/:id").delete(TestimonyController_1.remove);
PrivateRoutes.post("/portofolio", PortofolioController_1.create);
PrivateRoutes.route("/portofolio/:id").patch(PortofolioController_1.update);
PrivateRoutes.route("/portofolio/:id").delete(PortofolioController_1.remove);
exports.default = PrivateRoutes;
