import { NextFunction, Request, Response } from "express";
import path from "path";
import moment from "moment";

import fsP from "fs/promises";
import fs from "fs";

import { db } from "../app/database";
import { IdValidation, validate } from "../validation/validation";

const partner = db.partnership;
const name = "partners";

export const get = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      const results = await partner.findMany();
      return res.status(200).json({ data: results });
    }

    const result = await partner.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (result === null) {
      return res.status(404).json({ errors: "Data Not Found" });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ errors: "Field `name` must defined" });
    }
    // Validasi Data yang sudah ada
    const ProductExist = await partner.count({
      where: {
        name: { contains: req.body.name },
      },
    });
    if (ProductExist > 1)
      return res.status(409).json({ error: "Partner already exist" });

    if (req.files === null) {
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
    const filename =
      req.body.name.replace(" ", "_") +
      moment().format("DDMMYYY-h_mm_ss") +
      ext;
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
      path.join(__dirname, "..", "..", "public", "images", name, filename)
    );
    await partner.create({
      data: {
        name: req.body.name,
        image: url,
        filename: filename,
      },
    });
    res.status(201).json({ message: `Created successfully` });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ errors: "Field `name` must defined" });
    }

    // Validate If data exist
    const thatOnePartner = await partner.findFirst({
      where: { id: parseInt(req.params.id) },
    });
    if (thatOnePartner === null) {
      return res
        .status(400)
        .json({ error: `Partner ${req.params.id} Not exist!` });
    }

    // Validate files

    if (req.files === null)
      return res.status(400).json({
        error: true,
        message: "Image upload required",
        details: "Image must be uploaded in the 'image' property",
      });

    const newfile = req.files.image;
    const filesize = newfile.data.length;
    const ext = path.extname(newfile.name);
    const filename =
      req.body.name.replace(" ", "_") +
      moment().format("DDMMYYY-h_mm_ss") +
      ext;
    const newurl = `${process.env.PROTOCOL}${process.env.HOST}/images/${name}/${filename}`;
    const allowedType = [".png", ".jpg", ".svg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: `File Type Unsupported` });

    if (filesize > 5000000)
      return res.status(422).json({ message: `File too big` });

    newfile.mv(
      path.join(__dirname, "..", "..", "public", "images", name, filename),
      async (err: Error) => {
        if (err) return res.status(500).json({ messages: `Can't save file` });
      }
    );

    // set the data
    await partner.update({
      data: {
        name: req.body.name,
        image: newurl,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    const filename_fromdb = thatOnePartner.filename;
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      name,
      filename_fromdb
    );
    if (fs.existsSync(filepath)) {
      await fsP.unlink(filepath);
    }

    return res.status(200).json({ message: "Data Updated Succesfully" });
  } catch (error) {
    next(error);
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
    const thatOneParner = await partner.findFirst({
      where: { id: validatedIds },
    });

    if (thatOneParner === null) {
      return res
        .status(400)
        .json({ error: `Data ${req.params.id} Not exist!` });
    }

    await partner.delete({ where: { id: parseInt(req.params.id) } });

    const filename = thatOneParner.filename;
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      name,
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
