import { NextFunction, Request, Response } from "express";
import { db } from "../app/database";
import { IdValidation, validate } from "../validation/validation";
import { handleFile, removeFile } from "../middleware/files-middleware";
import { ResponseError } from "../error/response-error";
import { PartnerValidation } from "../validation/PartnerValidation";
const partner = db.partnership;

export const get = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.params["id"]) {
      const results = await partner.findMany();
      return res.status(200).json({ data: results });
    }
    await validate(IdValidation, req.params["id"]);

    const result = await partner.findFirst({
      where: {
        id: parseInt(req.params["id"]),
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
    await validate(PartnerValidation, req.body);
    const partnerExist = await partner.count({
      where: {
        name: req.body.name,
      },
    });
    if (partnerExist >= 1)
      throw new ResponseError(409, `Partner ${req.body.name} already exist`);
    const { filename, url } = handleFile(req, "image");
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
    await validate(IdValidation, req.params["id"]);
    await validate(PartnerValidation, req.body);

    const thatOnePartner = await partner.findFirst({
      where: { id: parseInt(req.params["id"]) },
    });
    if (thatOnePartner === null) {
      throw new ResponseError(400, `Partner ${req.params["id"]} Not exist!`);
    }

    const { filename: newname, url: newurl } = handleFile(req, "image");

    // set the data
    await partner.update({
      data: {
        name: req.body.name,
        image: newurl,
        filename: newname,
      },
      where: {
        id: parseInt(req.params["id"]),
      },
    });
    removeFile(thatOnePartner);

    return res.status(200).json({ message: "Data Updated Succesfully" });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: any, res: Response, next: NextFunction) => {
  try {
    const valId = validate(IdValidation, req.params["id"]);
    const thatOneParner = await partner.findFirst({
      where: { id: valId },
    });

    if (thatOneParner === null) {
      return res
        .status(400)
        .json({ error: `Data ${req.params["id"]} Not exist!` });
    }
    removeFile(thatOneParner);
    await partner.delete({ where: { id: parseInt(req.params["id"]) } });
    res.status(200).json({ message: `Data ${valId} Deleted Successfully` });
  } catch (e) {
    next(e);
  }
};
