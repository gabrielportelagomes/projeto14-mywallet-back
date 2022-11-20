import { ObjectID } from "bson";
import dayjs from "dayjs";
import { recordsCollection } from "../database/db.js";

export async function postRecord(req, res) {
  const record = res.locals.record;
  const user = res.locals.user;

  try {
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
  const id = res.locals.recordId;

  try {
    await recordsCollection.deleteOne({ _id: ObjectID(id) });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function putRecord(req, res) {
  const record = res.locals.record;
  const id = res.locals.recordId;

  try {
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
