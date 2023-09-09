import { NextFunction, Request, Response } from "express";
import { db } from "../app/database";
import { IdValidation, Validate } from "../validation/validation";
import { PortofolioValidation } from "../validation/PortofolioValidation";
import { ResponseError } from "../error/response-error";
import { handleFile, removeFile } from "../middleware/files-middleware";
const portofolio = db.portofolio;

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params["id"]) {
      const results = await portofolio.findMany();
      return res.status(200).json({ data: results });
    }
    await Validate(IdValidation, req.params["id"]);
    const result = await portofolio.findFirst({
      where: {
        id: parseInt(req.params["id"]),
      },
    });

    if (result === null) {
      throw new ResponseError(
        404,
        `Portofolio with ID ${req.params["id"]} not found`
      );
    }
    return res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const create = async (req: any, res: Response, next: NextFunction) => {
  try {
    const valbody = Validate(PortofolioValidation, req.body);
    const portofolioExist = await portofolio.findFirst({
      where: {
        title: valbody.title,
      },
    });
    if (portofolioExist !== null)
      return res.status(409).json({ error: "portofolio already exist" });
    const { filename, url } = handleFile(req, "image");
    await portofolio.create({
      data: {
        title: req.body.title,
        image: url,
        desc: req.body.desc,
        filename: filename,
      },
    });
    res.status(201).json({ message: `portofolio created successfully` });
  } catch (e) {
    next(e);
  }
};

const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Validate(PortofolioValidation, req.body);
    const theportofolio = await portofolio.findFirst({
      where: { id: parseInt(req.params["id"]) },
    });
    if (theportofolio === null) {
      throw new ResponseError(
        404,
        `Portofolio with ID ${req.params["id"]} not found`
      );
    }
    const { filename: newname, url: newurl } = handleFile(req, "image");
    await portofolio.update({
      data: {
        desc: req.body.desc,
        title: req.body.title,
        image: newurl,
        filename: newname,
      },
      where: {
        id: parseInt(req.params["id"]),
      },
    });
    await removeFile(theportofolio);
    return res.status(200).json({ message: "Data Updated Succesfully" });
  } catch (e) {
    next(e);
  }
};

const remove = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validatedIds = await Validate(IdValidation, req.params["id"]);
    if (validatedIds === null) {
      return;
    }

    const theportofolio = await portofolio.findFirst({
      where: { id: validatedIds },
    });

    if (theportofolio === null) {
      return res
        .status(404)
        .json({ error: `Portofolio with ID ${req.params["id"]} Not exist!` });
    }

    await portofolio.delete({ where: { id: theportofolio.id } });
    await removeFile(theportofolio);
    return res.status(200).json({
      message: `Portofolio with ID ${validatedIds} Deleted Succesfully`,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, get, update, remove };
