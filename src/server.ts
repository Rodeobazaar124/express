import "dotenv/config";
import express, { Request, Response, response } from "express";
import cors from "cors";
import fileupload from "express-fileupload";
import path from "path";
require("./core/passport");
// import AuthRouter from "./routes/AuthRoutes";
import { errorMiddleware } from "./middleware/error-middleware";
import Routes from "./routes/Routes";
export const app = express();

export const PORT = process.env.PORT || 8080 || 3000;

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
app.use("/api", Routes);
app.use(errorMiddleware);

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
