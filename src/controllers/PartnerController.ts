import { NextFunction, Request, Response } from "express";
import { db } from "../app/database";
import { IdValidation, Validate } from "../validation/validation";
import { handleFile, removeFile } from "../middleware/files-middleware";
import { PartnerValidation } from "../validation/PartnerValidation";
import { Action, checkExistsThrow } from "../middleware/checkfromdb";
import { slugVal } from "../validation/RangeValidation";
const partner = db.partnership;

const get = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.params["id"]) {
      const results = await partner.findMany();
      return res.status(200).json({ data: results });
    }
    await Validate(IdValidation, req.params["id"]);
    const result = await checkExistsThrow(
      "Partnership",
      "id",
      Number(req.params["id"]),
      Action.GET
    );

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const create = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Validate(PartnerValidation, req.body);
    const partnerExist = await checkExistsThrow(
      "Partnership",
      "name",
      req.body["name"],
      Action.CREATE
    );

    const { filename, url } = handleFile(req, "image");
    const data = await partner.create({
      data: {
        name: req.body.name,
        image: url,
        filename: filename,
      },
    });
    res.status(201).json({ message: `Created successfully`, data });
  } catch (error) {
    next(error);
  }
};

const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Validate(IdValidation, req.params["id"]);
    await Validate(PartnerValidation, req.body);
    const thatOnePartner = await checkExistsThrow(
      "Partnership",
      "id",
      Number(req.params["id"]),
      Action.UPDATE
    );

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

const remove = async (req: any, res: Response, next: NextFunction) => {
  try {
    const valId: Number = await Validate(IdValidation, req.params["id"]);
    const thatOnePartner = await checkExistsThrow(
      "Partnership",
      "id",
      valId,
      Action.DELETE
    );

    removeFile(thatOnePartner);
    await partner.delete({ where: { id: parseInt(req.params["id"]) } });
    res.status(200).json({ message: `Data ${valId} Deleted Successfully` });
  } catch (e) {
    next(e);
  }
};

export default { create, get, update, remove };
