import { app } from "./server";
import { PORT } from "./server";
import fs from "fs";
import fsP from "fs/promises";
import path from "path";
import { logger } from "./core/logging";

try {
  if (!fs.existsSync(path.join(__dirname, "..", "public"))) {
    fsP.mkdir(path.join(__dirname, "..", "public"));
  }
  if (!fs.existsSync(path.join(__dirname, "..", "public", "images"))) {
    fsP.mkdir(path.join(__dirname, "..", "public", "images"));
  }
  if (
    !fs.existsSync(path.join(__dirname, "..", "public", "images", "avatars"))
  ) {
    fsP.mkdir(path.join(__dirname, "..", "public", "images", "avatars"));
  }
  if (
    !fs.existsSync(path.join(__dirname, "..", "public", "images", "partners"))
  ) {
    fsP.mkdir(path.join(__dirname, "..", "public", "images", "partners"));
  }
  if (
    !fs.existsSync(path.join(__dirname, "..", "public", "images", "products"))
  ) {
    fsP.mkdir(path.join(__dirname, "..", "public", "images", "products"));
  }
  if (
    !fs.existsSync(path.join(__dirname, "..", "public", "images", "services"))
  ) {
    fsP.mkdir(path.join(__dirname, "..", "public", "images", "services"));
  }
} catch (error) {
  logger.error(error);
}

app.listen(PORT, () => {
  console.log(`[Server] We're up on http://localhost:${PORT} sir!`);
});
