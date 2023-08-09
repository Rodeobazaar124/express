import Joi from "joi";

export const ProductBodyValidation = Joi.object({
  title: Joi.string().max(50).required(),
  desc: Joi.string().min(10).required(),
});
