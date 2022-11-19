import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

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
export const recordsCollection = db.collection("records");
