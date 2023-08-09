import "dotenv/config";
import express, { Request, Response, response } from "express";
import cors from "cors";
import fileupload from "express-fileupload";
import path from "path";
import bodyParser from "body-parser";
// import TestimoniesRoutes from "./routes/TestimoniesRoutes";
import ServicesRoutes from "./routes/ServicesRoutes";
import ProductsRoutes from "./routes/ProductsRoutes";
import HeroRoutes from "./routes/HeroRoutes";
import TestimonyRoutes from "./routes/TestimonyRoutes";
// import { errorMiddleware } from "./middleware/error-middleware";

export const app = express();
export const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(express.static(path.join(__dirname, "../public")));

// app.use("/Testimonies", TestimoniesRoutes);
app.use("/services", ServicesRoutes);
app.use("/products", ProductsRoutes);
app.use("/hero", HeroRoutes);
app.use("/testimony", TestimonyRoutes);
// app.use(errorMiddleware);
