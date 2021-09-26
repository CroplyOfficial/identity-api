import express from "express";
import { onboarding } from "../controllers/adminControllers";

const router = express.Router();

router.route("/onboarding").post(onboarding);

export default router;
