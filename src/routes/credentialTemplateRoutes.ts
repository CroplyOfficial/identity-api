import express from "express";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageCredentials } from "../middleware/roles";
import {
  createNewCredentialTemplate,
  editCredentialTemplate,
  indexCredentialTemplates,
  findOneCredential,
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

router.route("/find").get(ensureAuthorized, findOneCredential);

export default router;
