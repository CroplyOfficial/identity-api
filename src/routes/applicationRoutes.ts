import express from "express";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageApplications } from "../middleware/roles";
import { createNewApplication } from "../controllers/applicationControllers";

const router = express.Router();

router
  .route("/")
  .post(
    ensureAuthorized,
    ensureIsStaff,
    canManageApplications,
    createNewApplication
  );

export default router;
