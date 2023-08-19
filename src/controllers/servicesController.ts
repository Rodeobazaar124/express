import { NextFunction, Request, Response } from "express";
import path from "path";
import moment from "moment";
import fsP from "fs/promises";
import fs from "fs";
import { prismaClient } from "../app/database";
import { IdValidation, validate } from "../validation/validation";
import { ServiceValidation } from "../validation/ServiceValidation";

const service = prismaClient.service;

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      const results = await service.findMany();
      return res.status(200).json({ data: results });
    }

    const results = await service.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (results === null) {
      return res.status(404).json({ errors: "Data Not Found" });
    }
    return res.status(200).json({ data: results });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: any, res: Response, next: NextFunction) => {
  const valbody = validate(ServiceValidation, req.body, res);
  if (valbody === null) {
    return;
  }
  // Validasi Data yang sudah ada
  const ProductExist = await service.count({
    where: {
      title: { contains: valbody.title },
    },
  });
  if (ProductExist > 1)
    return res.status(409).json({ error: "Product already exist" });

  if (req.files === null) {
    return res.status(400).json({
      error: {
        code: "MISSING_LOGO",
        message: "Bad Request: An image file is required for this operation.",
        details:
          "Please make sure to include a valid image file in the 'logo' field.",
      },
    });
  }

  // File Handler
  const file = req.files.logo;
  const filesize = file.data.length;
  const ext = path.extname(file.name);
  const filename = file.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
  const url = `${process.env.PROTOCOL}${process.env.HOST}/images/${filename}`;

  // Validasi File Type
  const allowedType = [".png", ".jpg", ".svg"];
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: `File Type Unsupported` });

  // Validasi ukuran file
  if (filesize > 5000000)
    return res.status(422).json({ message: `File too big` });

  // Menyimpan file
  file.mv(
    path.join(__dirname, "..", "..", "public", "images", "services", filename),
    async (err: Error) => {
      if (err) return res.status(500).json({ messages: `${err.message}` });

      // Menyimpan nama file beserta data
      try {
        await service.create({
          data: {
            title: req.body.title,
            logo: url,
            desc: req.body.desc,
            link: req.body.link,
          },
        });
        res.status(200).json({ message: `Created successfully` });
      } catch (e) {
        next(e);
      }
    }
  );
};

export const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    const valbody = validate(ServiceValidation, req.body, res);
    if (valbody === null) {
      return;
    }

    // Validate If data exist
    const theServices = await service.findFirst({
      where: { id: parseInt(req.params.id) },
    });
    if (theServices === null) {
      return res
        .status(400)
        .json({ error: `Data ${req.params.id} Not exist!` });
    }

    // Validate files

    if (req.files == null)
      return res.status(400).json({
        error: true,
        message: "Image upload required",
        details: "Image must be uploaded in the 'logo' property",
      });

    const newfile = req.files.logo;
    const filesize = newfile.data.length;
    const ext = path.extname(newfile.name);
    const filename = newfile.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
    const newurl = `${process.env.PROTOCOL}${process.env.HOST}/images/${filename}`;
    const allowedType = [".png", ".jpg", ".svg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: `File Type Unsupported` });

    if (filesize > 5000000)
      return res.status(422).json({ message: `File too big` });

    newfile.mv(
      path.join(__dirname, "..", "..", "public", "images", "services", filename)
    );

    // set the data
    await service.update({
      data: {
        desc: req.body.desc,
        title: req.body.title,
        logo: newurl,
        link: req.body.link,
      },
      where: { id: parseInt(req.params.id) },
    });

    const oldfile = theServices.logo.split("/");
    const filename_fromdb = oldfile[oldfile.length - 1];
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      "services",
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
    const Service = await service.findFirst({
      where: { id: validatedIds },
    });

    if (Service === null) {
      return res
        .status(400)
        .json({ error: `Data ${req.params.id} Not exist!` });
    }

    await service.delete({ where: { id: parseInt(req.params.id) } });

    const file = Service.logo.split("/");
    const filename = file[file.length - 1];
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      "services",
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
