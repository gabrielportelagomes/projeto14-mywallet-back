import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouters from "./routes/usersRoutes.js";
import recordsRouters from "./routes/recordsRoutes.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(json());
app.use(usersRouters);
app.use(recordsRouters);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
