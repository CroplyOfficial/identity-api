import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Role from "../models/Role";
import User from "../models/User";

/**
 * Route to create a new role
 *
 * @route POST /api/roles
 * @returns {IRole}
 */

const createRole = asyncHandler(async (req: Request, res: Response) => {
  const { users, name, history, applications, credentials, identity } =
    req.body;
  const role = await Role.create({
    name: name,
    canManageUsers: users,
    canViewHistory: history,
    canManageApplications: applications,
    canManageCredentials: credentials,
    canManageIdentity: identity,
  });
  res.json(role);
});

/**
 * Route to assign a role to a user
 *
 * @route POST /api/roles/assign
 * @returns {IUser}
 */

const assignRole = asyncHandler(async (req: Request, res: Response) => {
  const { id, role } = req.body;
  const user = await User.findById(id);
  const newRole = await Role.findById(role);
  if (user && newRole) {
    user.role = newRole._id;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User or Role Not Found");
  }
});

export { createRole, assignRole };
