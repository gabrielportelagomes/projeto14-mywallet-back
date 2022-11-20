import { Router } from "express";
import {
  postSignUp,
  postSignIn,
  getUser,
  deleteSignOut,
} from "../controllers/usersController.js";

const router = Router();

router.post("/sign-up", postSignUp);

router.post("/sign-in", postSignIn);

router.get("/user", getUser);

router.delete("/sign-out", deleteSignOut);

export default router;
