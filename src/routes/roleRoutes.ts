import express from "express";
import Role from "../models/Role";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageUsers } from "../middleware/roles";
import { createRole, assignRole } from "../controllers/roleControllers";

const router = express.Router();

router
  .route("/")
  .post(ensureAuthorized, ensureIsStaff, canManageUsers, createRole);

router
  .route("/assign")
  .post(ensureAuthorized, ensureIsStaff, canManageUsers, assignRole);

export default router;
