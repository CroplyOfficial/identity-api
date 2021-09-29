import express from "express";
import { onboarding, getAdminConf } from "../controllers/adminControllers";
import { ensureAuthorized, ensureIsOwner } from "../middleware/auth";

const router = express.Router();

router.route("/onboarding").post(onboarding);
router.route("/config").get(ensureAuthorized, ensureIsOwner, getAdminConf);

export default router;
