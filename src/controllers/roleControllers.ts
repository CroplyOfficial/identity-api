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
  console.log(req.body);
});

export { createRole };
