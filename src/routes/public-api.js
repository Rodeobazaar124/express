"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var HeroController_1 = require("../controllers/HeroController");
var PartnerController_1 = require("../controllers/PartnerController");
var servicesController_1 = require("../controllers/servicesController");
var TestimonyController_1 = require("../controllers/TestimonyController");
var ProductsController_1 = require("../controllers/ProductsController");
var PortofolioController_1 = require("../controllers/PortofolioController");
var Routes = (0, express_1.Router)();
// HERO
Routes.route("/hero/").get(HeroController_1.get);
Routes.route("/hero/:id/").get(HeroController_1.get);
Routes.route("/hero/:position/").get(HeroController_1.get);
// PARTNER
Routes.route("/partner/").get(PartnerController_1.get);
Routes.route("/partner/:id").get(PartnerController_1.get);
// SERVICES
Routes.route("/service/").get(servicesController_1.get);
Routes.route("/service/:id").get(servicesController_1.get);
// TESTIMONY
Routes.route("/testimony/").get(TestimonyController_1.get);
Routes.route("/testimony/:id").get(TestimonyController_1.get);
// PRODUCT
Routes.route("/product/").get(ProductsController_1.get);
Routes.route("/product/:id").get(ProductsController_1.get);
// PRODUCT
Routes.route("/portofolio/").get(PortofolioController_1.get);
Routes.route("/portofolio/:id").get(PortofolioController_1.get);
exports.default = Routes;
