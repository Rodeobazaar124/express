import { NextFunction, Request, Response } from "express";
import { db } from "../app/database";
import { IdValidation, Validate } from "../validation/validation";
import {
  HeroPosVal,
  HeroValidationLeft,
  HeroValidationRight,
} from "../validation/HeroValidation";
import { Action, checkExistsThrow } from "../middleware/checkfromdb";
import { ResponseError } from "../error/response-error";

const hero = db.hero;

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //   getMany

    if (!req.params["id"]) {
      if (!req.query["position"]) {
        const result = await hero.findMany();
        return res.status(200).json({
          data: result,
        });
      }
      switch (req.query["position"]) {
        case "left":
          const hasilLeft = await hero.findMany({
            where: { position: req.query["position"] },
          });
          return res.status(200).json({ data: hasilLeft });
        case "right":
          const hasilRight = await hero.findMany({
            where: { position: req.query["position"] },
          });
          return res.status(200).json({ data: hasilRight });
        default:
          throw new ResponseError(
            400,
            `Incorrect Position, choose left or right`
          );
      }
    }

    // check per id
    const parsedId = await Validate(IdValidation, req.params["id"]);
    const hasilId = await checkExistsThrow("Hero", "id", parsedId, Action.GET);
    return res.status(200).json({ data: hasilId });
  } catch (error) {
    return next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Validate(HeroPosVal, req.body);
    let valbody: any;

    if (req.body["position"].toLowerCase() == "left") {
      valbody = Validate(HeroValidationLeft, req.body);
      await checkExistsThrow("Hero", "hText", valbody["hText"], Action.CREATE);
    } else if (req.body["position"].toLowerCase() == "right") {
      valbody = Validate(HeroValidationRight, req.body);
      await checkExistsThrow(
        "Hero",
        "number",
        valbody["number"],
        Action.CREATE
      );
    }

    const result = await hero.create({
      data: valbody,
    });
    return res
      .status(201)
      .json({ message: "Hero created successfully", data: result });
  } catch (e) {
    next(e);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Cek apakah params punya ID yang benar
    const valIds = await Validate(IdValidation, req.params["id"]);
    // Cek Apakah body memiliki kolom position
    await Validate(HeroPosVal, req.body);
    let valbody: any;

    // Cek posisi kanan atau kiri
    if (req.body["position"].toLowerCase() == "left") {
      valbody = Validate(HeroValidationLeft, req.body);

      // validasi apakah datanya sama dengan data sebelumnya
      await checkExistsThrow("Hero", "hText", valbody["hText"], Action.CREATE);
    } else if (req.body["position"].toLowerCase() == "right") {
      valbody = Validate(HeroValidationRight, req.body);

      // validasi apakah datanya sama dengan data sebelumnya
      await checkExistsThrow(
        "Hero",
        "number",
        valbody["number"],
        Action.CREATE
      );
    }

    // Validate If data exist
    await checkExistsThrow("Hero", "id", valIds, Action.UPDATE);

    const result = await hero.update({
      where: { id: parseInt(valIds) },
      data: valbody,
    });
    return res.status(200).json({ msg: "Updated successfully", data: result });
  } catch (e) {
    next(e);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const valIds = await Validate(IdValidation, req.params["id"]);
    const { result } = await checkExistsThrow(
      "Hero",
      "id",
      parseInt(valIds),
      Action.DELETE
    );
    await hero.delete({ where: { id: valIds } });
    return res.status(200).json({ msg: "data deleted", data: result });
  } catch (e) {
    next(e);
  }
};
