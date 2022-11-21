import joi from "joi";

export const recordSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().min(1).max(30).required(),
  category: joi.valid("income", "expense").required(),
});
