import { ObjectID } from "bson";
import dayjs from "dayjs";
import {
  usersCollection,
  sessionsCollection,
  recordsCollection,
} from "../database/db.js";
import { recordSchema } from "../index.js";

export async function postRecord(req, res) {
  const record = req.body;
  const user = res.locals.user;

  try {
    const { error } = recordSchema.validate(record, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).send(errorDetails);
    }

    const newRecord = {
      ...record,
      date: dayjs().format("DD/MM/YYYY"),
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
  const user = res.locals.user;

  try {
    const records = await recordsCollection
      .find({ userId: user._id })
      .toArray();

    const monthRecords = records
      .filter((record) => {
        if (
          record.date.split("/")[1] + "/" + record.date.split("/")[2] ===
          dayjs().format("MM/YYYY")
        ) {
          return record;
        }
      })
      .reverse();

    res.send(monthRecords);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deleteRecord(req, res) {
  const id = req.params.id;
  const user = res.locals.user;

  try {
    const record = await recordsCollection.findOne({ _id: ObjectID(id) });

    if (record.userId.toString() !== user._id.toString()) {
      return res.sendStatus(401);
    }

    await recordsCollection.deleteOne({ _id: ObjectID(id) });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function putRecord(req, res) {
  const id = req.params.id;
  const record = req.body;
  const user = res.locals.user;

  try {
    const { error } = recordSchema.validate(record, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).send(errorDetails);
    }

    const registeredRecord = await recordsCollection.findOne({
      _id: ObjectID(id),
    });

    if (registeredRecord.userId.toString() !== user._id.toString()) {
      return res.sendStatus(401);
    }

    await recordsCollection.updateOne(
      { _id: new ObjectID(id) },
      { $set: record }
    );

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
