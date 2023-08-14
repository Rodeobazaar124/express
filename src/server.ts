import "dotenv/config";
import express, { Request, Response, response } from "express";
import cors from "cors";
import fileupload from "express-fileupload";
import path from "path";
import ServicesRoutes from "./routes/ServicesRoutes";
import ProductsRoutes from "./routes/ProductsRoutes";
import HeroRoutes from "./routes/HeroRoutes";
import TestimonyRoutes from "./routes/TestimonyRoutes";
// import { errorMiddleware } from "./middleware/error-middleware";
import cookieSession from "cookie-session";
import passport from "passport";
require("./core/passport");
import AuthRouter from "./routes/AuthRoutes";
import PartnerRoutes from "./routes/PartnerRoutes";
export const app = express();

export const PORT = process.env.PORT || 8000 || 3000;

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["cyberwolve"],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

app.use(
  cors()
  //   {
  //   origin: "http://localhost:8000",
  //   methods: "GET,POST,PUT,DELETE",
  //   credentials: true,
  // }
);
app.use(express.json());
app.use(fileupload());
app.use(express.static(path.join(__dirname, "../public")));

// app.use("/Testimonies", TestimoniesRoutes);
app.use("/auth", AuthRouter);
app.use("/services", ServicesRoutes);
app.use("/products", ProductsRoutes);
app.use("/hero", HeroRoutes);
app.use("/testimonies", TestimonyRoutes);
app.use("/partner", PartnerRoutes);
// app.use(errorMiddleware);
