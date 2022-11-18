import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import usersRouters from "./routes/usersRoutes.js";

export const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const app = express();

dotenv.config();
app.use(cors());
app.use(json());
app.use(usersRouters);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
