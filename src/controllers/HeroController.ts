import { Request, Response } from "express";
import { prismaClient } from "../core/database";
import { IdValidation, validate } from "../validation/validation";
import { HeroValidation } from "../validation/HeroValidation";

const hero = prismaClient.hero;

export const get = async (req: Request, res: Response) => {
  try {
    //   getMany
    if (!req.params.id) {
      const hasil = await hero.findMany();
      return res.status(200).json({ data: hasil });
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
          return res.status(200).json({ data: hasilId });
        } else {
          return res.status(400).json({ error: "Invalid ID format" });
        }
    }
  } catch (error) {
    return res.status(500).json({
      message: `We're so sorry it's look like we have error on the server`,
    });
  }
};

export const create = async (req: Request, res: Response) => {
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
        // Handle creation failure
        return res.status(500).json({ error: "Something went wrong" });
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
        return res.status(500).json({ error: "Something went wrong" });
      }

    default:
      return res.status(400).json({ error: "Invalid position" });
  }

  // Validate
};

export const update = async (req: Request, res: Response) => {
  const valbody = validate(HeroValidation, req.body, res);
  const valIds = validate(IdValidation, req.params.id, res);
  if (valbody === null) {
    return;
  }
  if (valIds === null) {
    return;
  }

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
  if (valIds === null) {
    return;
  }
  const check = await hero.findFirst({ where: { id: valIds } });
  if (check === null) {
    return res.status(400).json({ error: `ID ${valIds} Not exist!` });
  }
  await hero.delete({ where: { id: valIds } });
  return res.status(200).json({ msg: "data deleted", data: check });
};
