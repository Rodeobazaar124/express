import { NextFunction, Request, Response } from "express";
import { db } from "../app/database";
import { IdValidation, validate } from "../validation/validation";
import { TestimonyValidation } from "../validation/TestimonyValidation";
import { handleFile, removeFile } from "../middleware/files-middleware";

const Testimony = db.testimony;

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params["id"]) {
      const results = await Testimony.findMany();
      return res.status(200).json({ data: results });
    }

    const result = await Testimony.findFirst({
      where: {
        id: parseInt(req.params["id"]),
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
  try {
    const valbody = validate(TestimonyValidation, req.body);
    // Validasi Data yang sudah ada
    const TestimonyExist = await Testimony.findFirst({
      where: {
        username: valbody.username,
      },
    });
    if (TestimonyExist != null)
      return res.status(409).json({ error: "Testimony already exist" });
    const { filename, url } = handleFile(req, "avatar");

    await Testimony.create({
      data: {
        username: valbody.username,
        avatar: url,
        rating: valbody.rating,
        location: valbody.location,
        comment: valbody.comment,
        filename: filename,
      },
    });
    res.status(201).json({ message: `Created successfully` });
  } catch (e) {
    next(e);
  }
};

export const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    const valbody = validate(TestimonyValidation, req.body);

    // Validate If data exist
    const thatOne = await Testimony.findFirst({
      where: { id: parseInt(req.params["id"]) },
    });
    if (thatOne === null) {
      return res
        .status(400)
        .json({ error: `ID ${req.params["id"]} Not exist!` });
    }
    const { filename: newname, url: newurl } = handleFile(req, "avatar");

    await Testimony.update({
      data: {
        username: valbody.username,
        avatar: newurl,
        filename: newname,
        rating: valbody.rating,
        location: valbody.location,
        comment: valbody.comment,
      },
      where: {
        id: parseInt(req.params["id"]),
      },
    });
    await removeFile(thatOne);
    return res.status(200).json({ message: "Data Updated Succesfully" });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validatedIds = validate(IdValidation, req.params["id"]);
    const theTestimony = await Testimony.findFirst({
      where: { id: validatedIds },
    });

    if (theTestimony === null) {
      return res
        .status(400)
        .json({ error: `Data ${req.params["id"]} Not exist!` });
    }

    await Testimony.delete({ where: { id: parseInt(req.params["id"]) } });
    await removeFile(theTestimony);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (e) {
    next(e);
  }
};
