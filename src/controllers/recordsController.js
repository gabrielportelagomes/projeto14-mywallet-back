import { usersCollection, sessionsCollection, recordsCollection } from "../database/db.js";
import { recordSchema } from "../index.js";

export async function postRecord(req, res) {
  const { authorization } = req.headers;
  const record = req.body;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const { error } = recordSchema.validate(record, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).send(errorDetails);
    }

    const session = await sessionsCollection.findOne({ token });

    console.log(session);

    const user = await usersCollection.findOne({
      _id: session?.userId,
    });
    console.log(user);

    if (!user) {
      return res.sendStatus(401);
    }

    const newRecord = { ...record, userId: user._id };

    console.log(newRecord);

    await recordsCollection.insertOne(newRecord);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
