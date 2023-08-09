import { Request, Response } from "express";
import Joi from "joi";

export const IdValidation = Joi.number().min(1).positive().required();

export const validate = (schema: Joi.Schema, request: any, res: Response) => {
  const result = schema.validate(request, {
    abortEarly: false,
  });

  if (result.error) {
    const errorMessage = result.error.details
      .map((detail) => detail.message)
      .join(", ");
    res.status(400).json({ error: errorMessage });
    return null;
  } else {
    return result.value;
  }
};
