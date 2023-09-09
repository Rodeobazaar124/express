import Joi from "joi";

export const RegisterValidation = Joi.object({
    name: Joi.string().max(255).required(),
    username: Joi.string().max(255).alphanum().required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().max(255).required(),
});
