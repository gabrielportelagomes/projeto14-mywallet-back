import express, { json } from "express";
import cors from "cors";
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

app.post("/sign-up", postSignUp);

app.post("/sign-in", postSignIn);

app.delete("/sign-out", deleteSignOut);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
