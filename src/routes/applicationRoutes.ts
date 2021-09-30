import express from "express";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageApplications } from "../middleware/roles";
import {
  createNewApplication,
  indexApplications,
} from "../controllers/applicationControllers";

const router = express.Router();

router
  .route("/")
  .get(
    ensureAuthorized,
    ensureIsStaff,
    canManageApplications,
    indexApplications
  )
  .post(ensureAuthorized, createNewApplication);

export default router;
