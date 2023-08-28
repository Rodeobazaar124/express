import Joi from "joi";

export const NoiuInRangeValidation = Joi.object({
  name: Joi.string().max(255).min(1).required(),
  amount: Joi.number().max(255).min(1).optional(),
});
export const NoiuUpdateValidation = Joi.object({
  name: Joi.string().max(255).min(1).optional(),
  amount: Joi.number().max(255).min(1).optional(),
});

export const slugVal = Joi.string().min(1).required();
