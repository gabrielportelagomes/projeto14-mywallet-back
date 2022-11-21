import joi from "joi";

export const recordSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required().min(1).max(100),
  category: joi.valid("income", "expense").required(),
});
