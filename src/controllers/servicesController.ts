import { NextFunction, Request, Response } from "express";
import path from "path";
import moment from "moment";
import fsP from "fs/promises";
import fs from "fs";
import { db } from "../app/database";
import { IdValidation, validate } from "../validation/validation";
import { ServiceValidation } from "../validation/ServiceValidation";
import { handleFile, removeFile } from "../middleware/files-middleware";
import { ResponseError } from "../error/response-error";

const service = db.service;
const dirname = "services";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params["id"]) {
      const results = await service.findMany();
      return res.status(200).json({ data: results });
    }
    await validate(IdValidation, req.params["id"]);
    const results = await service.findFirst({
      where: {
        id: parseInt(req.params["id"]),
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
  try {
    const valbody = validate(ServiceValidation, req.body);
    // Validasi Data yang sudah ada
    const ProductExist = await service.count({
      where: {
        title: valbody.title,
      },
    });
    if (ProductExist >= 1)
      return res.status(409).json({ error: "Product already exist" });
    const { filename, url } = handleFile(req, "logo");
    await service.create({
      data: {
        title: req.body.title,
        logo: url,
        desc: req.body.desc,
        link: req.body.link,
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
    await validate(ServiceValidation, req.body);

    // Validate If data exist
    const theServices = await service.findFirst({
      where: { id: parseInt(req.params["id"]) },
    });
    if (theServices === null) {
      return res
        .status(400)
        .json({ error: `Data ${req.params["id"]} Not exist!` });
    }
    const { filename: newname, url: newurl } = handleFile(req, "logo");
    await service.update({
      data: {
        desc: req.body.desc,
        title: req.body.title,
        logo: newurl,
        filename: newname,
        link: req.body.link,
      },
      where: { id: parseInt(req.params["id"]) },
    });
    await removeFile(theServices);

    return res.status(200).json({ message: "Data Updated Succesfully" });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validatedIds = validate(IdValidation, req.params["id"]);

    const Service = await service.findFirst({
      where: { id: validatedIds },
    });

    if (Service === null) {
      throw new ResponseError(404, `Service ${req.params["id"]} Not exist!`);
    }

    await service.delete({ where: { id: parseInt(req.params["id"]) } });
    await removeFile(Service);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (e) {
    next(e);
  }
};
