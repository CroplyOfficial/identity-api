import express from "express";
import {
  createUser,
  loginWithPassword,
  loginWithPin,
} from "../controllers/userControllers";

const router = express.Router();

router.route("/").post(createUser);

router.route("/login_with_pin").post(loginWithPin);

router.route("/login_with_password").post(loginWithPassword);

export default router;
