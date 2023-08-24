import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import fileupload from "express-fileupload";
import path from "path";
import fs from "fs";
import fsP from "fs/promises";
// require("./passport");
import { AuthRoutes } from "../routes/AuthRoutes";

import { errorMiddleware } from "../middleware/error-middleware";
import Routes from "../routes/public-api";
import PrivateRoutes from "../routes/api";
import { logger } from "./logging";
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
export const checkOrCreateFolder = function (folder: string | any) {
  if (!fs.existsSync(folder)) {
    fsP.mkdir(path.join(folder));
  }
};

export const createfolder = async () => {
  try {
    const publicdir = path.join(__dirname, "..", "public");
    checkOrCreateFolder(publicdir);
    checkOrCreateFolder(path.join(publicdir, "images"));
    checkOrCreateFolder(path.join(publicdir, "images", "avatars"));
    checkOrCreateFolder(path.join(publicdir, "images", "partners"));
    checkOrCreateFolder(path.join(publicdir, "images", "products"));
    checkOrCreateFolder(path.join(publicdir, "images", "services"));
    checkOrCreateFolder(path.join(publicdir, "images", "portofolios"));
  } catch (error) {
    logger.error(error);
  }
};
createfolder();
app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(express.static(path.join(__dirname, "..", "..", "public")));

// app.use("/Testimonies", TestimoniesRoutes);
app.use("/api", PrivateRoutes);
app.use("/api", Routes);
app.use("/api/auth", AuthRoutes);
app.use(errorMiddleware);

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "..", "views", "404.html"));
});

app.listen(PORT, () => {
  console.log(`[Server] We're up on http://localhost:${PORT} sir!`);
});
