import { Router } from "express";
import {postRecord, getRecords} from "../controllers/recordsController.js"

const router = Router();

router.post("/records", postRecord);
router.get("/records", getRecords);

export default router;
