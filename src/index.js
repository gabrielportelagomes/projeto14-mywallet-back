import express, { json } from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import {
  postSignUp,
  postSignIn,
  deleteSignOut,
} from "./controllers/usersController.js";

export const userSchema = joi.object({
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
export const usersCollection = db.collection("users");
export const sessionsCollection = db.collection("sessions");

app.post("/sign-up", postSignUp);

app.post("/sign-in", postSignIn);

app.delete("/sign-out", deleteSignOut);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
