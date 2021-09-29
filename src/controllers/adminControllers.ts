import asyncHandler from "express-async-handler";
import { startOnboarding } from "../utils/adminUtils/onboarding";
import { Request, Response } from "express";
import User from "../models/User";

const onboarding = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;
  const user = await User.findById(id);
  // todo: create a hashing function that mixes userid and our secret
  const onboardingData = await startOnboarding(id, "password");
  res.json(onboardingData);
});

export { onboarding };
