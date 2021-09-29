import express from "express";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageCredentials } from "../middleware/roles";
import {
  createNewCredentialTemplate,
  editCredentialTemplate,
  indexCredentialTemplates,
  getCredentialTemplateById,
  deleteCredentialTemplate,
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
  .get(ensureAuthorized, indexCredentialTemplates);

router
  .route("/:id")
  .get(ensureAuthorized, getCredentialTemplateById)
  .delete(
    ensureAuthorized,
    ensureIsStaff,
    canManageCredentials,
    deleteCredentialTemplate
  )
  .patch(
    ensureAuthorized,
    ensureIsStaff,
    canManageCredentials,
    editCredentialTemplate
  );

export default router;
