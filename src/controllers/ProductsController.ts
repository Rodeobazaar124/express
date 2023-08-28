import { NextFunction, Request, Response } from "express";
import { db } from "../app/database";
import { IdValidation, Validate } from "../validation/validation";
import { ProductBodyValidation } from "../validation/ProductValidation";
import { handleFile, removeFile } from "../middleware/files-middleware";
import { ResponseError } from "../error/response-error";

const product = db.product;

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params["id"]) {
      const results = await product.findMany();
      return res.status(200).json({ data: results });
    }
    await Validate(IdValidation, req.params["id"]);
    const result = await product.findFirst({
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
    const valbody = await Validate(ProductBodyValidation, req.body);
    const ProductExist = await product.findFirst({
      where: {
        title: valbody.title,
      },
    });
    if (ProductExist !== null)
      return res.status(409).json({ error: "Product already exist" });
    const { filename, url } = await handleFile(req, "image");

    await product.create({
      data: {
        title: req.body.title,
        image: url,
        desc: req.body.desc,
        filename: filename,
      },
    });
    res.status(201).json({ message: `Product created successfully` });
  } catch (e) {
    next(e);
  }
};

export const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Validate(ProductBodyValidation, req.body);

    // Validate If data exist
    const theProduct = await product.findFirst({
      where: { id: parseInt(req.params["id"]) },
    });
    if (theProduct === null) {
      throw new ResponseError(404, `Product ${req.params["id"]} Not exist!`);
    }
    const { filename: newname, url: newurl } = handleFile(req, "image");
    // set the data
    await product.update({
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

    await removeFile(theProduct);
    return res
      .status(200)
      .json({ message: `Data ${req.params["id"]} Updated Succesfully` });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validatedIds = await Validate(IdValidation, req.params["id"]);

    const theProduct = await product.findFirst({
      where: { id: validatedIds },
    });

    if (theProduct === null) {
      throw new ResponseError(404, `Product ${validatedIds} Not exist!`);
    }

    await product.delete({ where: { id: parseInt(req.params["id"]) } });
    removeFile(theProduct);
    return res.status(200).json({
      message: `Product with ID ${validatedIds} Deleted Succesfully`,
    });
  } catch (e) {
    next(e);
  }
};
