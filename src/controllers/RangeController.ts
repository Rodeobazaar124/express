import { NextFunction, Request, Response } from "express";
import { Validate } from "../validation/validation";
import {
  NoiuInRangeValidation,
  NoiuUpdateValidation,
  slugVal,
} from "../validation/RangeValidation";
import { ResponseError } from "../error/response-error";
import { db } from "../app/database";

export const slugMaker = (name: string) => {
  try {
    const slug: string = name
      .replace(/ /g, "-") // Use regex to replace all occurrences of spaces with dashes
      .toLowerCase()
      .replace(/[^\w-]+/g, "");
    return slug; // Return just the slug string, not inside an object
  } catch (e) {
    throw new ResponseError(500, `slugMaker: ${e.message}`); // Throw the error
  }
};

export const createRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = await Validate(NoiuInRangeValidation, req.body);
    body["slug"] = slugMaker(body.name);
    const existingRange = await db.noiu_in_range.findUnique({
      where: { slug: body["slug"] },
    });

    if (existingRange) {
      throw new ResponseError(400, "Range already exists");
    }
    const data = await db.noiu_in_range.create({
      data: body,
    });
    res.status(201).json({ message: "Range created successfully", data });
  } catch (e) {
    next(e);
  }
};

export const readRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params["slug"]) {
      const ranges = await db.noiu_in_range.findMany();
      return res.json({ data: ranges });
    }

    const slug = await Validate(slugVal, req.params["slug"]);
    const range = await db.noiu_in_range.findUnique({ where: { slug } });

    if (!range) {
      throw new ResponseError(404, "Data not found");
    }

    return res.json(range);
  } catch (e) {
    next(e);
  }
};

export const updateRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate params slug
    const slugParams = await Validate(slugVal, req.params["slug"]);

    // Validate if there's a slug in the body
    const slug = await Validate(NoiuUpdateValidation, req.body);

    // If there is a name field in the req.body, run slugMaker and update the slug
    if (req.body.name) {
      const updatedSlug = slugMaker(req.body.name);
      req.body.slug = updatedSlug;
    }

    // Validate if data exists, if not exist throw.
    const existingRange = await db.noiu_in_range.findUnique({
      where: { slug: slugParams },
    });
    if (!existingRange) {
      throw new ResponseError(404, "Data not found");
    }

    // Ensure that the amount field is a valid integer before updating
    if (req.body.amount !== undefined) {
      const parsedAmount = parseInt(req.body.amount, 10);
      if (isNaN(parsedAmount)) {
        throw new ResponseError(400, "Invalid amount value");
      }
      req.body.amount = parsedAmount;
    }

    // Update the range data
    const updatedRange = await db.noiu_in_range.update({
      where: { slug: slugParams },
      data: req.body,
    });

    return res.json({
      message: "Data updated successfully",
      data: updatedRange,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await db.noiu_in_range.delete({ where: { slug: req.params["slug"] } }); // Use await for the delete operation
    res.status(204).send(); // Send a success response with no content
  } catch (e) {
    next(e);
  }
};
