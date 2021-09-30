import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Application, { IApplicationType } from "../models/Applications";
import CredentialTemplate from "../models/CredentialTemplate";

/**
 * Get all the applications that have ever been registered
 * route is protected and only accesible to staff with the
 * canManageApplications permission specified
 *
 * @route GET /api/applications
 * @returns IApplicationType[]
 */

const indexApplications = asyncHandler(async (req: Request, res: Response) => {
  const applications = await Application.find()
    .populate("applicant")
    .populate("template")
    .exec();
  if (!applications) {
    res.status(404);
    throw new Error("no applications found");
  }
  res.json(applications);
});

/**
 * Create new application from a template, this controller
 * would serve to validate the stuff also to make sure
 * someone doesn't enter extra fields that get added into
 * the credential
 *
 * @route POST /api/applications
 * @returns IApplicationType
 */

const createNewApplication = asyncHandler(
  async (req: Request, res: Response) => {
    const { applicant, template, data } = req.body;
    const credentialTemplate = await CredentialTemplate.findById(template);
    if (!credentialTemplate) {
      res.status(404);
      throw new Error("CredentialTemplate not found");
    }
    const credKeys = credentialTemplate.fields.map((field) => field.label);
    if (JSON.stringify(credKeys) === JSON.stringify(Object.keys(data))) {
      const application = await Application.create({
        applicant: req.user._id,
        template,
        data,
      });
      res.json(application);
    } else {
      res.status(400);
      throw new Error("Bad Request");
    }
  }
);

export { indexApplications, createNewApplication };
