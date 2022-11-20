import { Router } from "express";
import { postRecord, getRecords, deleteRecord } from "../controllers/recordsController.js";

const router = Router();

router.post("/records", postRecord);

router.get("/records", getRecords);

router.delete("/records/:id", deleteRecord);

export default router;
