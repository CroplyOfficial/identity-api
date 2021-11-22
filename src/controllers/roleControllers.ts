import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Role from "../models/Role";
import User from "../models/User";

/**
 * Get all the roles that have been created till now,
 * restricted to only users with user management perms
 *
 * @returns {IRole[]}
 */

const indexAllRoles = asyncHandler(async (req: Request, res: Response) => {
  const roles = await Role.find();
  if (roles) {
    res.json(roles);
  } else {
    res.status(404);
    throw new Error("No Roles Found");
  }
});

/**
 * Get role by ID
 *
 * @route GET /api/roles/:id
 * @returns {IRole}
 */

const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const role = await Role.findById(req.params.id);
  if (role) {
    res.json(role);
  } else {
    res.status(404);
    throw new Error("Role not found");
  }
});

/**
 * update role by ID
 *
 * @route PATCH /api/roles/:id
 * @returns {IRole}
 */

const editRoleByID = asyncHandler(async (req: Request, res: Response) => {
  const { users, name, history, applications, credentials, identity } =
    req.body;
  const role = await Role.findById(req.params.id);

  if (role) {
    role.name = name ?? role.name;
    role.canManageUsers = users ?? role.canManageUsers;
    role.canManageApplications = applications ?? role.canManageApplications;
    role.canViewHistory = history ?? role.canViewHistory;
    role.canManageCredentials = credentials ?? role.canManageCredentials;
    role.canManageIdentity = identity ?? role.canManageIdentity;

    const updated = await role.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error("Role not found");
  }
});

/**
 * Delete role by id
 *
 * @route DELETE /api/roles/:id
 * @returns {IRole}
 */

const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (role) {
    res.json(role);
  } else {
    res.status(404);
    throw new Error("Role not found");
  }
});

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
 * @route POST /api/roles/@staff/assign
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

export {
  createRole,
  assignRole,
  indexAllRoles,
  getRoleById,
  editRoleByID,
  deleteRole,
};
