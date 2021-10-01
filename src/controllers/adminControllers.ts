import asyncHandler from "express-async-handler";
import { startOnboarding } from "../utils/adminUtils/onboarding";
import { Request, Response } from "express";
import { getConfig } from "../utils/adminUtils/configUtil";
import User from "../models/User";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../") });

/**
 * Start the onboarding of the user which esentially does 3 tasks
 * - Create a new user that becomes the owner
 * - Create an issuer identity for the organisaiton
 * - Create a new RSA keypair for DVID
 *
 * @route POST /org/onboarding
 */

const onboarding = asyncHandler(async (req: Request, res: Response) => {
  const { id, domain } = req.body;
  const user = await User.findById(id);
  if (!user) throw new Error("user not found");
  const onboardingData = await startOnboarding(
    id,
    process.env.STRONGHOLD_SECRET as string,
    domain
  );
  res.json(onboardingData);
});

/**
 * Get the config that is saved
 *
 * @route GET /api/admin/config
 * @retunrs Config
 */

const getAdminConf = asyncHandler(async (req: Request, res: Response) => {
  const config = await getConfig();
  res.json(config);
});

export { onboarding, getAdminConf };
