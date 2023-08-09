import Joi from "joi";

export const ServiceValidation = Joi.object({
  title: Joi.string().max(50).required(),
  desc: Joi.string().min(10).optional(),
  link: Joi.string().required(),
});
