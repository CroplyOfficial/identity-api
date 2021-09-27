import { getConfig } from "../utils/configUtil";
import User from "../models/User";
import { UserType } from "../models/User";
import Role, { RoleType } from "../models/Role";
import asyncHandler from "express-async-handler";

const checkForPermission = async (user: UserType, permission: string) => {
  const conf = await getConfig();
  if (String(conf.owner) === String(user._id)) return true;
  const role: RoleType | null = await Role.findById(user.role);
  if (!role) {
    throw new Error("unauthorized");
  }
  // @ts-ignore
  if (role.toJSON()[permission] === true) {
    return true;
  } else {
    throw new Error("unauthorized");
  }
};

const canManageCredentials = asyncHandler(async (req, res, next) => {
  if (await checkForPermission(req.user, "canManageCredentials")) {
    next();
  }
});

const canManageApplications = asyncHandler(async (req, res, next) => {
  if (await checkForPermission(req.user, "canManageApplications")) {
    next();
  }
});

const canViewHistory = asyncHandler(async (req, res, next) => {
  if (await checkForPermission(req.user, "canViewHisory")) {
    next();
  }
});

const canManageIdentity = asyncHandler(async (req, res, next) => {
  if (await checkForPermission(req.user, "canManageIdentity")) {
    next();
  }
});

const canManageUsers = asyncHandler(async (req, res, next) => {
  if (await checkForPermission(req.user, "canManageUsers")) {
    next();
  }
});

export {
  canManageUsers,
  canManageIdentity,
  canViewHistory,
  canManageApplications,
  canManageCredentials,
};
