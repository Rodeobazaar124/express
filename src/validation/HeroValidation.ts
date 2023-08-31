import Joi from "joi";

export const HeroValidationRight = Joi.object({
  number: Joi.number().positive().required(),
  position: Joi.string().max(5).min(4).required(),
  text: Joi.string().required(),
});

export const HeroPosVal = Joi.object({
  position: Joi.string().max(5).min(4).required(),
  number: Joi.number().positive().optional(),
  text: Joi.string().optional(),
  hText: Joi.string().optional(),
  desc: Joi.string().min(10).required().optional(),
});

export const HeroValidationLeft = Joi.object({
  position: Joi.string().max(5).min(4).required(),
  text: Joi.string().required(),
  hText: Joi.string().required(),
  desc: Joi.string().min(10).required().required(),
});
