import { Router } from "express";
import {
  postRecord,
  getRecords,
  deleteRecord,
  putRecord,
} from "../controllers/recordsController.js";
import { authValidation } from "../middlewares/authValidationMiddleware.js";
import { recordValidation } from "../middlewares/recordValidationMiddleware.js";

const router = Router();

router.use(authValidation);

router.post("/records", recordValidation, postRecord);

router.get("/records", getRecords);

router.delete("/records/:id", deleteRecord);

router.put("/records/:id", recordValidation, putRecord);

export default router;
