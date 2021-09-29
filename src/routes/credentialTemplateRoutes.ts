import express from "express";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageCredentials } from "../middleware/roles";
import {
  createNewCredentialTemplate,
  editCredentialTemplate,
  indexCredentialTemplates,
} from "../controllers/credentialTemplateControllers";

const router = express.Router();

router
  .route("/")
  .post(
    ensureAuthorized,
    ensureIsStaff,
    canManageCredentials,
    createNewCredentialTemplate
  )
  .get(
    ensureAuthorized,
    ensureIsStaff,
    canManageCredentials,
    indexCredentialTemplates
  );

router
  .route("/:id")
  .patch(
    ensureAuthorized,
    ensureIsStaff,
    canManageCredentials,
    editCredentialTemplate
  );

export default router;
