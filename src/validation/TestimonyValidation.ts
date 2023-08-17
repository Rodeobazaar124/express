import Joi from "joi";

export const TestimonyValidation = Joi.object({
  username: Joi.string().max(64).required(),
  location: Joi.string().max(64).required(),
  comment: Joi.string().max(255).required(),
  rating: Joi.number().required(),
});
