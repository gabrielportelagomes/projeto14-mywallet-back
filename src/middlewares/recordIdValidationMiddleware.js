import { recordsCollection } from "../database/db.js";
import { ObjectID } from "bson";

export async function recordIdValidation(req, res, next) {
  const id = req.params.id;
  const user = res.locals.user;
  try {
    const record = await recordsCollection.findOne({ _id: ObjectID(id) });

    if (record.userId.toString() !== user._id.toString()) {
      return res.status(401).send("Você não possui permisão para efetuar essa ação!");
    }

    res.locals.recordId = id;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
