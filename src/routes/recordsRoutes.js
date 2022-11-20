import { Router } from "express";
import {
  postRecord,
  getRecords,
  deleteRecord,
  putRecord,
} from "../controllers/recordsController.js";
import { authValidation } from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.use(authValidation);

router.post("/records", postRecord);

router.get("/records", getRecords);

router.delete("/records/:id", deleteRecord);

router.put("/records/:id", putRecord);

export default router;
