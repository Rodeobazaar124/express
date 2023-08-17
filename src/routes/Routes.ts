import { Router } from "express";
import AuthRouter from "./AuthRoutes";
import HeroRoutes from "./HeroRoutes";
import PartnerRoutes from "./PartnerRoutes";
import ProductsRoutes from "./ProductsRoutes";
import servicesRoutes from "./ServicesRoutes";
import TestimonyRoutes from "./TestimonyRoutes";

const Routes = Router();
Routes.use("/auth", AuthRouter);
Routes.use("/services", servicesRoutes);
Routes.use("/products", ProductsRoutes);
Routes.use("/hero", HeroRoutes);
Routes.use("/testimonies", TestimonyRoutes);
Routes.use("/partners", PartnerRoutes);

export default Routes;
