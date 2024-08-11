import Joi from "joi";

export const productValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  price: Joi.number().positive().precision(2).required(),
  userId: Joi.string().length(24).hex().required(),
  image: Joi.string().uri().allow(""),
});

export const updateProductValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  price: Joi.number().positive().precision(2),
  image: Joi.string().uri().allow(""),
});
