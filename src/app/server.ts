import "dotenv/config";
import express from "express";
import cors from "cors";
import fileupload from "express-fileupload";
import path from "path";
import { AuthRoutes } from "../routes/AuthRoutes";

import { errorMiddleware } from "../middleware/error-middleware";
import Routes from "../routes/public-api";
import PrivateRoutes from "../routes/api";
import view from "../routes/view";
import { userRoutes } from "../routes/UserRoutes";
export const app = express();

export const PORT = process.env.PORT || 80 || 8000;

app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(express.static(path.join("public")));

// app.use("/Testimonies", TestimoniesRoutes);
app.use("/api/v1", PrivateRoutes);
app.use("/api/v1", Routes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", userRoutes);
app.use(view);

app.get("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    return res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    return res.json({ error: "404 Not Found" });
  } else {
    res.send("404 Not Found");
  }
});

app.use(errorMiddleware);
