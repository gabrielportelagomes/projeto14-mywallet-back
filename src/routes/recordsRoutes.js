import { Router } from "express";
import {postRecord} from "../controllers/recordsController.js"

const router = Router();

router.post("/record", postRecord);

export default router;
