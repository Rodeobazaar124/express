import { NextFunction, Request, Response } from "express";
import path from "path";
import moment from "moment";
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

    const result = await product.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (result === null) {
      return res.status(404).json({ errors: "Data Not Found" });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ errors: "Cannot get data or data not found" });
  }
};

export const create = async (req: any, res: Response) => {
  const valbody = validate(ProductBodyValidation, req.body, res);
  if (valbody === null) {
    return;
  }
  // Validasi Data yang sudah ada
  const ProductExist = await product.count({
    where: {
      title: { contains: valbody.title },
    },
  });
  if (ProductExist > 1)
    return res.status(409).json({ error: "Product already exist" });

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
  const filename = file.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
  const url = `${process.env.PROTOCOL}://${process.env.HOST}/images/${filename}`;

  // Validasi File Type
  const allowedType = [".png", ".jpg", ".svg"];
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: `File Type Unsupported` });

  // Validasi ukuran file
  if (filesize > 5000000)
    return res.status(422).json({ message: `File too big` });

  // Menyimpan file
  file.mv(`public/images/${filename}`, async (err: Error) => {
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
      res.status(200).json({ message: `Created successfully` });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error creating Product: ${error.message}` });
    }
  });
};

export const update = async (req: any, res: Response) => {
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
        .status(400)
        .json({ error: `Data ${req.params.id} Not exist!` });
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
    const newurl = `${process.env.PROTOCOL}://${process.env.HOST}/images/${filename}`;
    const allowedType = [".png", ".jpg", ".svg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: `File Type Unsupported` });

    if (filesize > 5000000)
      return res.status(422).json({ message: `File too big` });

    newfile.mv(`public/images/${filename}`, async (err: Error) => {
      if (err) return res.status(500).json({ messages: `Can't save file` });
    });

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
    fs.unlink(`public/images/${filename_fromdb}`, (err) => {
      if (err) {
        console.log({
          error: err,
          where: "updateProduct->OldFileRemover",
        });
      }
    });

    return res.status(200).json({ message: "Data Updated Succesfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Cannot Update ${req.params.id}, (${error})` });
  }
};

export const remove = async (req: any, res: Response) => {
  try {
    const validatedIds = validate(IdValidation, req.params.id, res);
    if (validatedIds === null) {
      return;
    }
    if (validatedIds === null) {
      return;
    }
    const theProduct = await product.findFirst({
      where: { id: validatedIds },
    });

    if (theProduct === null) {
      return res
        .status(400)
        .json({ error: `Data ${req.params.id} Not exist!` });
    }

    await product.delete({ where: { id: parseInt(req.params.id) } });

    try {
      const file = theProduct.image.split("/");
      const filename = file[file.length - 1];
      fs.unlink(`public/images/${filename}`, (err) => {
        if (err) {
          console.log({
            error: err,
            where: "Product: Remove->OldFileRemover",
          });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "IMAGE NOT FOUND BUT DATA DELETED" });
    }
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(`[ERROR] deleteProduct: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
