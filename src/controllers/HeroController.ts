import { NextFunction, Request, Response } from "express";
import { db } from "../app/database";
import { IdValidation, validate } from "../validation/validation";
import { HeroValidation } from "../validation/HeroValidation";

const hero = db.hero;

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //   getMany
    if (!req.params.id) {
      const left = await hero.findMany({ where: { position: "Left" } });
      const right = await hero.findMany({ where: { position: "Right" } });
      return res.status(200).json({
        data: {
          left,
          right,
        },
      });
    }
    switch (req.params.id.toLowerCase()) {
      case "left":
        const hasilLeft = await hero.findMany({
          where: { position: "Left" },
        });
        return res.status(200).json({ data: hasilLeft });
      case "right":
        const hasilRight = await hero.findMany({
          where: { position: "Right" },
        });
        return res.status(200).json({ data: hasilRight });
      default:
        const parsedId = parseInt(req.params.id);
        if (!isNaN(parsedId)) {
          const hasilId = await hero.findMany({
            where: { id: parsedId },
          });
          if (hasilId === null) {
            return res
              .status(404)
              .json({ errors: `Hero with ID ${parsedId} does not found` });
          }
          return res.status(200).json({ data: hasilId });
        } else {
          return res.status(400).json({ error: "Invalid ID format" });
        }
    }
  } catch (error) {
    return next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const valbody = validate(HeroValidation, req.body, res);
  if (valbody === null) {
    return;
  }
  switch (req.params.id.toLowerCase()) {
    case "left":
      valbody.position = "left";
      if (!valbody.hText || !valbody.desc) {
        return res.status(400).json({
          error: "'desc' and `hText` field must exist for left hero",
        });
      }
      try {
        const result = await hero.create({
          data: valbody,
        });
        // Handle successful creation
        return res
          .status(201)
          .json({ message: "Hero created successfully", data: result });
      } catch (error) {
        next(error);
      }

    case "right":
      valbody.position = "right";
      if (!valbody.number) {
        return res.status(400).json({
          error: "Number should exist for right hero",
        });
      }
      try {
        const result = await hero.create({
          data: valbody,
        });
        return res
          .status(201)
          .json({ message: "Hero created successfully", data: result });
      } catch (error) {
        next(error);
      }

    default:
      return res.status(400).json({ error: "Invalid position" });
  }
};

export const update = async (req: Request, res: Response) => {
  const valbody = validate(HeroValidation, req.body, res);
  const valIds = validate(IdValidation, req.params.id, res);
  if (valbody === null) {
    return;
  }
  if (valIds === null) return;

  // Validate If data exist
  const theProduct = await hero.findFirst({
    where: { id: parseInt(req.params.id) },
  });
  if (theProduct === null) {
    return res.status(400).json({ error: `Data ${req.params.id} Not exist!` });
  }
  const result = await hero.update({
    where: { id: parseInt(valIds) },
    data: valbody,
  });
  return res.status(200).json({ msg: "success", data: result });
};

export const remove = async (req: Request, res: Response) => {
  const valIds = validate(IdValidation, req.params.id, res);
  if (valIds === null) return;
  const check = await hero.findFirst({ where: { id: valIds } });
  if (check === null) {
    return res.status(400).json({ error: `ID ${valIds} Not exist!` });
  }
  await hero.delete({ where: { id: valIds } });
  return res.status(200).json({ msg: "data deleted", data: check });
};
