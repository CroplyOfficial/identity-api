import express from "express";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageApplications } from "../middleware/roles";
import {
  createNewApplication,
  indexApplications,
  getApplicationById,
  modApplicationStatus,
  getMyApplications,
  checkCredential,
  revokeCredential,
} from "../controllers/applicationControllers";

const router = express.Router();

router.route("/@me/current").get(ensureAuthorized, getMyApplications);

router
  .route("/")
  .get(
    ensureAuthorized,
    ensureIsStaff,
    canManageApplications,
    indexApplications
  )
  .post(ensureAuthorized, createNewApplication);

router
  .route("/:id")
  .get(
    ensureAuthorized,
    ensureIsStaff,
    canManageApplications,
    getApplicationById
  )
  .patch(
    ensureAuthorized,
    ensureIsStaff,
    canManageApplications,
    modApplicationStatus
  );

router
  .route("/revoke/:id")
  .post(
    ensureAuthorized,
    ensureIsStaff,
    canManageApplications,
    revokeCredential
  );

router.route("/@creds/verify").post(checkCredential);

export default router;
