import { Router } from "express";
import {postRecord, getRecords} from "../controllers/recordsController.js"

const router = Router();

router.post("/record", postRecord);
router.get("/record", getRecords);

export default router;
