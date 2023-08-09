import { NextFunction, Request, Response } from "express";
import path from "path";
import moment from "moment";
import fs from "fs";
import { prismaClient } from "../core/database";
import { IdValidation, validate } from "../validation/validation";
import { TestimonyValidation } from "../validation/TestimonyValidation";

const Testimony = prismaClient.testimony;

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
  } catch (error) {
    return res
      .status(500)
      .json({ errors: "Cannot get data or data not found" });
  }
};

export const create = async (req: any, res: Response) => {
  const valbody = validate(TestimonyValidation, req.body, res);
  if (valbody === null) {
    return;
  }
  // Validasi Data yang sudah ada
  const TestimonyExist = await Testimony.count({
    where: {
      username: { contains: valbody.title },
    },
  });
  if (TestimonyExist > 1)
    return res.status(409).json({ error: "Product already exist" });

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
  const url = `${process.env.PROTOCOL}://${process.env.HOST}/avatars/${filename}`;

  // Validasi File Type
  const allowedType = [".png", ".jpg", ".svg"];
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: `File Type Unsupported` });

  // Validasi ukuran file
  if (filesize > 5000000)
    return res.status(422).json({ message: `File too big` });

  // Menyimpan file
  file.mv(`public/avatars/${filename}`, async (err: Error) => {
    if (err) return res.status(500).json({ messages: `${err.message}` });

    // Menyimpan nama file beserta data
    try {
      await Testimony.create({
        data: {
          username: valbody.username,
          avatar: url,
          star: valbody.star,
          location: valbody.location,
          comment: valbody.comment,
        },
      });
      res.status(200).json({ message: `Created successfully` });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error adding new testimony: ${error.message}` });
    }
  });
};

export const update = async (req: any, res: Response) => {
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

    if (req.files == null)
      return res.status(400).json({
        error: true,
        message: "avatar upload required",
        details: "Image must be uploaded in the 'avatar' property",
      });

    const newfile = req.files.avatar;
    const filesize = newfile.data.length;
    const ext = path.extname(newfile.name);
    const filename = newfile.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
    const newurl = `${process.env.PROTOCOL}://${process.env.HOST}/avatars/${filename}`;
    const allowedType = [".png", ".jpg", ".svg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: `File Type Unsupported` });

    if (filesize > 5000000)
      return res.status(422).json({ message: `File too big` });

    newfile.mv(`public/avatars/${filename}`, async (err: Error) => {
      if (err) return res.status(500).json({ messages: `Can't save file` });
    });

    // set the data
    await Testimony.update({
      data: {
        username: valbody.username,
        avatar: newurl,
        star: valbody.star,
        location: valbody.location,
        comment: valbody.comment,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    const oldfile = thatOne.avatar.split("/");
    const filename_fromdb = oldfile[oldfile.length - 1];
    fs.unlink(`public/avatars/${filename_fromdb}`, (err) => {
      if (err) {
        console.log({
          error: err,
          where: "update: Old File Remover",
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
    const theProduct = await Testimony.findFirst({
      where: { id: validatedIds },
    });

    if (theProduct === null) {
      return res
        .status(400)
        .json({ error: `Data ${req.params.id} Not exist!` });
    }

    await Testimony.delete({ where: { id: parseInt(req.params.id) } });

    try {
      const file = theProduct.avatar.split("/");
      const filename = file[file.length - 1];
      fs.unlink(`public/avatars/${filename}`, (err) => {
        if (err) {
          console.log({
            error: err,
            where: "Product: Remove: Old File Remover",
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
