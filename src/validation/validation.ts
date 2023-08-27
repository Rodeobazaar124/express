import { Request, Response } from "express";
import Joi from "joi";
import { ResponseError } from "../error/response-error";

export const IdValidation = Joi.number().min(1).positive().required();

export const validate = (schema: Joi.Schema, request: any) => {
  const result = schema.validate(request, {
    abortEarly: false,
  });

  if (result.error) {
    const errorMessage = result.error.details
      .map((detail) => detail.message)
      .join(", ");
    throw new ResponseError(400, errorMessage);
  } else {
    return result.value;
  }
};
