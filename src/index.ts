import { app } from "./app/server";
import { PORT } from "./app/server";
import fs from "fs";
import fsP from "fs/promises";
import path from "path";
import { logger } from "./app/logging";

export const checkOrCreateFolder = function (folder: string | any) {
  if (!fs.existsSync(folder)) {
    fsP.mkdir(path.join(folder));
  }
};
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

app.listen(PORT, () => {
  console.log(`[Server] We're up on http://localhost:${PORT} sir!`);
});
