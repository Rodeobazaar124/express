import express from "express";
import {
  getTestimony,
  createTestimony,
  deleteTestimony,
  updateTestimony,
} from "../controllers/TestimoniesController";
import { body } from "express-validator";

const validateCreateTestimony = [
  body("username").notEmpty().isString(),
  body("comment").optional().isString(),
  body("star").notEmpty().isFloat(),
  body("avatar").notEmpty().isString(),
  body("location").notEmpty().isString(),
];

const TestimoniesRoutes = express.Router();

TestimoniesRoutes.route("/").get(getTestimony);
TestimoniesRoutes.post("/create", validateCreateTestimony, createTestimony);
TestimoniesRoutes.route("/update/:id").put(updateTestimony);
TestimoniesRoutes.route("/delete/:id").delete(deleteTestimony);
export default TestimoniesRoutes;
