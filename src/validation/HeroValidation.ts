import Joi from "joi";

export const HeroValidation = Joi.object({
  number: Joi.number().positive().optional(),
  position: Joi.string().max(5).min(4).lowercase().optional(), // Applying lowercase()
  text: Joi.string().lowercase().required(), // Applying lowercase()
  hText: Joi.string().optional(),
  desc: Joi.string().min(10).required().optional(),
});
