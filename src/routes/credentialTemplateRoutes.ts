import express from "express";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageApplications } from "../middleware/roles";
import {
  createNewCredentialTemplate,
  editCredentialTemplate,
} from "../controllers/credentialTemplateControllers";

const router = express.Router();

router
  .route("/")
  .post(
    ensureAuthorized,
    ensureIsStaff,
    canManageApplications,
    createNewCredentialTemplate
  );

router
  .route("/:id")
  .patch(
    ensureAuthorized,
    ensureIsStaff,
    canManageApplications,
    editCredentialTemplate
  );

export default router;
