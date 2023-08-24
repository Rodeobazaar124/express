import path from "path";
import { logger } from "../src/app/logging";
const fs = require("fs");
const fsP = require("fs/promises");
export const publicdir = path.join(__dirname, "public");
export const checkOrCreateFolder = function (folder: string | any) {
  if (!fs.existsSync(folder)) {
    fsP.mkdir(path.join(folder));
  }
};
export const createfolder = async () => {
  try {
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
import { app } from "../src/app/server";
export default app;
