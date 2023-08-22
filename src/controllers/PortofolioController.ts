import { NextFunction, Request, Response } from "express";
import path from "path";
import moment from "moment";
import fsP from "fs/promises";
import fs from "fs";

import { db } from "../app/database";
import { IdValidation, validate } from "../validation/validation";
import { PortofolioValidation } from "../validation/PortofolioValidation";
const portofolio = db.portofolio;
const name = "portofolios";
export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      const results = await portofolio.findMany();
      return res.status(200).json({ data: results });
    }
    const valIds = validate(IdValidation, req.params.id, res);
    if (valIds === null) return;
    const result = await portofolio.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (result === null) {
      return res.status(404).json({ errors: "Portofolio Not Found" });
    }
    return res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: any, res: Response, next: NextFunction) => {
  const valbody = validate(PortofolioValidation, req.body, res);
  if (valbody === null) {
    return;
  }
  // Validasi Data yang sudah ada
  const portofolioExist = await portofolio.findFirst({
    where: {
      title: valbody.title,
    },
  });
  if (portofolioExist !== null)
    return res.status(409).json({ error: "portofolio already exist" });

  if (req.files == null) {
    return res.status(400).json({
      error: {
        code: "MISSING_IMAGE",
        message: "Bad Request: An image file is required for this operation.",
        details:
          "Please make sure to include a valid image file in the 'image' field.",
      },
    });
  }

  // File Handler
  const file = req.files.image;
  const filesize = file.data.length;
  const ext = path.extname(file.name);
  const filename = file.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
  const url = `${process.env.PROTOCOL}${process.env.HOST}/images/${name}/${filename}`;

  // Validasi File Type
  const allowedType = [".png", ".jpg", ".svg"];
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: `File Type Unsupported` });

  // Validasi ukuran file
  if (filesize > 5000000)
    return res.status(422).json({ message: `File too big` });

  // Menyimpan file
  file.mv(
    path.join(__dirname, "..", "..", "public", "images", name, filename),
    async (err: Error) => {
      if (err) return res.status(500).json({ messages: `${err.message}` });

      // Menyimpan nama file beserta data
      try {
        await portofolio.create({
          data: {
            title: req.body.title,
            image: url,
            desc: req.body.desc,
          },
        });
        res.status(201).json({ message: `portofolio created successfully` });
      } catch (e) {
        next(e);
      }
    }
  );
};

export const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    const valbody = validate(PortofolioValidation, req.body, res);
    if (valbody === null) {
      return;
    }

    // Validate If data exist
    const theportofolio = await portofolio.findFirst({
      where: { id: parseInt(req.params.id) },
    });
    if (theportofolio === null) {
      return res
        .status(404)
        .json({ error: `Portofolio ID ${req.params.id} Does Not exist!` });
    }

    // Validate files

    if (req.files == null)
      return res.status(400).json({
        error: true,
        message: "Image upload required",
        details: "Image must be uploaded in the 'image' property",
      });

    const newfile = req.files.image;
    const filesize = newfile.data.length;
    const ext = path.extname(newfile.name);
    const filename = newfile.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
    const newurl = `${process.env.PROTOCOL}${process.env.HOST}/images/${name}/${filename}`;
    const allowedType = [".png", ".jpg", ".svg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: `File Type Unsupported` });

    if (filesize > 500000000)
      return res.status(422).json({ message: `File too big` });

    newfile.mv(
      path.join(__dirname, "..", "..", "public", "images", name, filename),
      async (err: Error) => {
        if (err) return res.status(500).json({ messages: `Can't save file` });
      }
    );

    // set the data
    await portofolio.update({
      data: {
        desc: req.body.desc,
        title: req.body.title,
        image: newurl,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    const oldfile = theportofolio.image.split("/");
    const filename_fromdb = oldfile[oldfile.length - 1];
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      "portofolio",
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

    const theportofolio = await portofolio.findFirst({
      where: { id: validatedIds },
    });

    if (theportofolio === null) {
      return res
        .status(404)
        .json({ error: `Portofolio with ID ${req.params.id} Not exist!` });
    }

    await portofolio.delete({ where: { id: parseInt(req.params.id) } });

    const file = theportofolio.image.split("/");
    const filename = file[file.length - 1];
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      "portofolio",
      filename
    );
    if (fs.existsSync(filepath)) {
      await fsP.unlink(filepath);
    }
    res.status(200).json({
      message: `Portofolio with ID ${validatedIds} Deleted Succesfully`,
    });
  } catch (e) {
    next(e);
  }
};
