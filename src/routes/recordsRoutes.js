import { Router } from "express";
import {
  postRecord,
  getRecords,
  deleteRecord,
  putRecord,
} from "../controllers/recordsController.js";

const router = Router();

router.post("/records", postRecord);

router.get("/records", getRecords);

router.delete("/records/:id", deleteRecord);

router.put("/records/:id", putRecord);

export default router;
