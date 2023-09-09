import Joi from "joi";

export const PartnerValidation = Joi.object({
  name: Joi.string().max(255).required(),
});
