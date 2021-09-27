import { Request, Response } from "express";
import Role from "../models/Role";
import asyncHandler from "express-async-handler";

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

export { createRole };
