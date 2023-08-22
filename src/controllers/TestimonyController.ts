import { NextFunction, Request, Response } from "express";
import path from "path";
import moment from "moment";
import fsP from "fs/promises";
import fs from "fs";
import { db } from "../app/database";
import { IdValidation, validate } from "../validation/validation";
import { TestimonyValidation } from "../validation/TestimonyValidation";

const Testimony = db.testimony;
const dirname = "avatars";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      const results = await Testimony.findMany();
      return res.status(200).json({ data: results });
    }

    const result = await Testimony.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (result === null) {
      return res.status(404).json({ errors: "Data Not Found" });
    }
    return res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: any, res: Response, next: NextFunction) => {
  const valbody = validate(TestimonyValidation, req.body, res);
  if (valbody === null) {
    return;
  }
  // Validasi Data yang sudah ada
  const TestimonyExist = await Testimony.findFirst({
    where: {
      username: valbody.username,
    },
  });
  if (TestimonyExist != null)
    return res.status(409).json({ error: "Testimony already exist" });

  if (req.files === null) {
    return res.status(400).json({
      error: {
        code: "MISSING_AVATARS",
        message: "Bad Request: An avatar file is required for this operation.",
        details:
          "Please make sure to include a valid image file in the 'avatar' field.",
      },
    });
  }

  // File Handler
  const file = req.files.avatar;
  const filesize = file.data.length;
  const ext = path.extname(file.name);
  const filename = file.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
  const url = `${process.env.PROTOCOL}${process.env.HOST}/${dirname}/${filename}`;

  // Validasi File Type
  const allowedType = [".png", ".jpg", ".svg"];
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: `File Type Unsupported` });

  // Validasi ukuran file
  if (filesize > 5000000)
    return res.status(422).json({ message: `File too big` });

  // Menyimpan file
  file.mv(
    path.join(__dirname, "..", "..", "public", "images", "avatars", filename),
    async (err: Error) => {
      if (err) return res.status(500).json({ messages: `${err.message}` });

      // Menyimpan nama file beserta data
      try {
        await Testimony.create({
          data: {
            username: valbody.username,
            avatar: url,
            rating: valbody.rating,
            location: valbody.location,
            comment: valbody.comment,
          },
        });
        res.status(201).json({ message: `Created successfully` });
      } catch (e) {
        next(e);
      }
    }
  );
};

export const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    const valbody = validate(TestimonyValidation, req.body, res);
    if (valbody === null) {
      return;
    }

    // Validate If data exist
    const thatOne = await Testimony.findFirst({
      where: { id: parseInt(req.params.id) },
    });
    if (thatOne === null) {
      return res.status(400).json({ error: `ID ${req.params.id} Not exist!` });
    }

    // Validate files

    if (req.files === null)
      return res.status(400).json({
        error: true,
        message: "avatar upload required",
        details: "Image must be uploaded in the 'avatar' property",
      });

    const newfile = req.files.avatar;
    const filesize = newfile.data.length;
    const ext = path.extname(newfile.name);
    const filename = newfile.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
    const newurl = `${process.env.PROTOCOL}${process.env.HOST}/${dirname}/${filename}`;
    const allowedType = [".png", ".jpg", ".svg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: `File Type Unsupported` });

    if (filesize > 5000000)
      return res.status(422).json({ message: `File too big` });

    newfile.mv(
      path.join(__dirname, "..", "..", "public", "images", dirname, filename)
    );

    // set the data
    await Testimony.update({
      data: {
        username: valbody.username,
        avatar: newurl,
        rating: valbody.rating,
        location: valbody.location,
        comment: valbody.comment,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    const oldfile = thatOne.avatar.split("/");
    const filename_fromdb = oldfile[oldfile.length - 1];
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      "avatars",
      filename_fromdb
    );
    if (fs.existsSync(filepath)) {
      await fsP.unlink(filepath);
    }

    return res.status(200).json({ message: "Data Updated Succesfully" });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validatedIds = validate(IdValidation, req.params.id, res);
    if (validatedIds === null) {
      return;
    }
    if (validatedIds === null) {
      return;
    }
    const theTestimony = await Testimony.findFirst({
      where: { id: validatedIds },
    });

    if (theTestimony === null) {
      return res
        .status(400)
        .json({ error: `Data ${req.params.id} Not exist!` });
    }

    await Testimony.delete({ where: { id: parseInt(req.params.id) } });

    const file = theTestimony.avatar.split("/");
    const filename = file[file.length - 1];
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      "avatars",
      filename
    );
    if (fs.existsSync(filepath)) {
      await fsP.unlink(filepath);
    }

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (e) {
    next(e);
  }
};
