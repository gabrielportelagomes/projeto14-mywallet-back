import { Router } from "express";
import {
  postSignUp,
  postSignIn,
  getUser,
  deleteSignOut,
} from "../controllers/usersController.js";
import { authValidation } from "../middlewares/authValidationMiddleware.js";

const router = Router();

router.post("/sign-up", postSignUp);

router.post("/sign-in", postSignIn);

router.get("/users", authValidation, getUser);

router.delete("/sign-out", authValidation, deleteSignOut);

export default router;
