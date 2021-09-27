import express from "express";
import Role from "../models/Role";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageUsers } from "../middleware/roles";
import { createRole } from "../controllers/roleControllers";

const router = express.Router();

router
  .route("/")
  .post(ensureAuthorized, ensureIsStaff, canManageUsers, createRole);

export default router;
