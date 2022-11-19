import dayjs from "dayjs";
import {
  usersCollection,
  sessionsCollection,
  recordsCollection,
} from "../database/db.js";
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

    const user = await usersCollection.findOne({
      _id: session?.userId,
    });

    if (!user) {
      return res.sendStatus(401);
    }

    const newRecord = {
      ...record,
      date: dayjs().format("DD/MM"),
      userId: user._id,
    };

    await recordsCollection.insertOne(newRecord);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getRecords(req, res) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await sessionsCollection.findOne({ token });

    const user = await usersCollection.findOne({
      _id: session?.userId,
    });

    if (!user) {
      return res.sendStatus(401);
    }

    const records = await recordsCollection
      .find({ userId: user._id })
      .toArray();

    res.send(records);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
