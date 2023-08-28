import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import moment from "moment";
import path from "path";
import { ResponseError } from "../error/response-error";
import fs from "fs";
import fsp from "fs/promises";
import { logger } from "../app/logging";

const mb = parseInt(process.env.FILE_SIZE_LIMIT_IN_MB) | 5;
const FILESIZE_LIMIT: number = mb * 1024 * 1024;
const allowedType = [".png", ".jpg", ".svg", ".jpeg", ".bmp", ".gif"];

export const handleFile = (req: Request | any, field: string | any) => {
  checkOrCreatePublicFolder();
  if (!req.files)
    throw new ResponseError(
      400,
      `Missing Files. Put it in the '${field}' field.`
    );

  if (!req.files[field])
    throw new ResponseError(400, `Put image file in the '${field}' field.`);

  const files = req.files[field] as UploadedFile;
  if (Number(files.size) > FILESIZE_LIMIT) {
    const message = `Upload failed. ${files.name} is over the filesize of ${mb} MB.`;
    throw new ResponseError(423, message);
  }

  if (!allowedType.includes(path.extname(files.name).toLowerCase()))
    throw new ResponseError(422, `File Type Unsupported`);

  const filename =
    files.md5 + moment().format("DDMMYYY-h_mm_ss") + path.extname(files.name);
  const url = `/images/${filename}`;

  files.mv(path.join("public", "images", filename));
  return { filename, url };
};

export const removeFile = async (theObject: any) => {
  try {
    await checkOrCreatePublicFolder();
    const fname_db = theObject.filename;
    const filepath = path.join("public", "images", fname_db);
    if (fs.existsSync(filepath)) {
      await fsp.unlink(filepath);
    }
    return "success";
  } catch (error) {
    throw new ResponseError(500, error);
  }
};

export const checkOrCreatePublicFolder = async () => {
  try {
    if (!fs.existsSync(path.join("public"))) {
      await fsp.mkdir(path.join("public"));
    }
    if (!fs.existsSync(path.join("public", "images"))) {
      await fsp.mkdir(path.join("public", "images"));
    }
  } catch (error) {
    throw new ResponseError(500, error);
  }
};
