import express from "express";
import {
  createUser,
  newStaffUser,
  loginWithPassword,
  getStaffUsers,
  loginWithPin,
  getUserInfo,
  assignDID,
} from "../controllers/userControllers";
import { ensureAuthorized, ensureIsStaff } from "../middleware/auth";
import { canManageUsers } from "../middleware/roles";

const router = express.Router();

router.route("/").post(createUser);

router
  .route("/staff-user")
  .post(ensureAuthorized, ensureIsStaff, canManageUsers, newStaffUser);

router
  .route("/@staff")
  .get(ensureAuthorized, ensureIsStaff, canManageUsers, getStaffUsers);

router.route("/login_with_pin").post(loginWithPin);
router.route("/@me").get(ensureAuthorized, getUserInfo);
router.route("/assign-did").post(ensureAuthorized, assignDID);

router.route("/login_with_password").post(loginWithPassword);

export default router;
