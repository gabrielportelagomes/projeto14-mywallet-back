import express, { json } from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { stripHtml } from "string-strip-html";

const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const app = express();

dotenv.config();
app.use(cors());
app.use(json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db("myWallet");
  console.log("MongoDb Conectado");
} catch (err) {
  console.log("Erro ao conectar com o MongoDb: ", err.message);
}

db = mongoClient.db("myWallet");
const usersCollection = db.collection("users");
const sessionsCollection = db.collection("sessions");

app.post("/sign-up", async (req, res) => {
  const user = req.body;

  try {
    const registeredUser = await usersCollection.findOne({ email: user.email });
    if (registeredUser) {
      return res.status(409).send({ message: "E-mail já cadastrado!" });
    }

    const { error } = userSchema.validate(user, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).send(errorDetails);
    }

    const hashPassword = bcrypt.hashSync(user.password, 12);
    await usersCollection.insertOne({ ...user, password: hashPassword });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const token = uuidV4();

  try {
    const registeredUser = await usersCollection.findOne({ email });

    if (!registeredUser) {
      return res.status(401).send({ message: "E-mail não cadastrado!" });
    }

    const passwordCheck = bcrypt.compareSync(password, registeredUser.password);

    if (!passwordCheck) {
      return res.sendStatus(401);
    }

    await sessionsCollection.insertOne({
      token,
      userId: registeredUser._id,
    });

    res.send({ token });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
