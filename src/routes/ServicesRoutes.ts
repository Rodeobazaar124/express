import express, { response } from "express";
import {
  getService,
  createService,
  deleteService,
  updateService,
} from "../controllers/ServicesController";
const ServicesRoutes = express.Router();

ServicesRoutes.route("/").get(getService);
ServicesRoutes.post("/create", createService);
ServicesRoutes.route("/update/:id").put(updateService);
ServicesRoutes.route("/delete/:id").delete(deleteService);

export default ServicesRoutes;
