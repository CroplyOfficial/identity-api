import express from "express";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageUsers } from "../middleware/roles";
import {
  createRole,
  assignRole,
  indexAllRoles,
  getRoleById,
  editRoleByID,
  deleteRole,
} from "../controllers/roleControllers";

const router = express.Router();

router
  .route("/")
  .get(ensureAuthorized, ensureIsStaff, canManageUsers, indexAllRoles)
  .post(ensureAuthorized, ensureIsStaff, canManageUsers, createRole);

router
  .route("/:id")
  .get(ensureAuthorized, ensureIsStaff, canManageUsers, getRoleById)
  .patch(ensureAuthorized, ensureIsStaff, canManageUsers, editRoleByID)
  .delete(ensureAuthorized, ensureIsStaff, canManageUsers, deleteRole);

router
  .route("/assign")
  .post(ensureAuthorized, ensureIsStaff, canManageUsers, assignRole);

export default router;
