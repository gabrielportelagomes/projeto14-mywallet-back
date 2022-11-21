import { recordSchema } from "../models/recordModel.js";

export async function recordValidation(req, res, next) {
  const record = req.body;

  try {
    const { error } = recordSchema.validate(record, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).send(errorDetails);
    }

    res.locals.record = record;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
