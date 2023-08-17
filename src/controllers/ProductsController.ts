import { NextFunction, Request, Response } from "express";
import path from "path";
import moment from "moment";
import fsP from "fs/promises";
import fs from "fs";

import { prismaClient } from "../core/database";
import { IdValidation, validate } from "../validation/validation";
import { ProductBodyValidation } from "../validation/ProductValidation";

const product = prismaClient.product;

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      const results = await product.findMany();
      return res.status(200).json({ data: results });
    }
    const valIds = validate(IdValidation, req.params.id, res);
    if (valIds === null) return;
    const result = await product.findFirst({
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
  const valbody = validate(ProductBodyValidation, req.body, res);
  if (valbody === null) {
    return;
  }
  // Validasi Data yang sudah ada
  const ProductExist = await product.findFirst({
    where: {
      title: valbody.title,
    },
  });
  if (ProductExist !== null)
    return res.status(409).json({ error: "Product already exist" });

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
    path.join(__dirname, "..", "..", "public", "images", "products", filename),
    async (err: Error) => {
      if (err) return res.status(500).json({ messages: `${err.message}` });

      // Menyimpan nama file beserta data
      try {
        await product.create({
          data: {
            title: req.body.title,
            image: url,
            desc: req.body.desc,
          },
        });
        res.status(200).json({ message: `Product created successfully` });
      } catch (e) {
        next(e);
      }
    }
  );
};

export const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    const valbody = validate(ProductBodyValidation, req.body, res);
    if (valbody === null) {
      return;
    }

    // Validate If data exist
    const theProduct = await product.findFirst({
      where: { id: parseInt(req.params.id) },
    });
    if (theProduct === null) {
      return res
        .status(404)
        .json({ error: `Product ID ${req.params.id} Does Not exist!` });
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
    const newurl = `${process.env.PROTOCOL}${process.env.HOST}/images/${filename}`;
    const allowedType = [".png", ".jpg", ".svg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: `File Type Unsupported` });

    if (filesize > 500000000)
      return res.status(422).json({ message: `File too big` });

    newfile.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        "products",
        filename
      ),
      async (err: Error) => {
        if (err) return res.status(500).json({ messages: `Can't save file` });
      }
    );

    // set the data
    await product.update({
      data: {
        desc: req.body.desc,
        title: req.body.title,
        image: newurl,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    const oldfile = theProduct.image.split("/");
    const filename_fromdb = oldfile[oldfile.length - 1];
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      "products",
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

    const theProduct = await product.findFirst({
      where: { id: validatedIds },
    });

    if (theProduct === null) {
      return res
        .status(404)
        .json({ error: `Product with ID ${req.params.id} Not exist!` });
    }

    await product.delete({ where: { id: parseInt(req.params.id) } });

    const file = theProduct.image.split("/");
    const filename = file[file.length - 1];
    const filepath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      "products",
      filename
    );
    if (fs.existsSync(filepath)) {
      await fsP.unlink(filepath);
    }
    res
      .status(200)
      .json({ message: `Product with ID ${validatedIds} Deleted Succesfully` });
  } catch (e) {
    next(e);
  }
};
