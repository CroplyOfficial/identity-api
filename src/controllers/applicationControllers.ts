import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Application, { IApplicationType } from "../models/Applications";
import CredentialTemplate from "../models/CredentialTemplate";
import { createVerifiableCredential } from "../utils/identityUtils/vc";

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
    .select("-data")
    .populate("applicant", ["username"])
    .populate("template", [
      "name",
      "referenceCode",
      "credentialType",
      "duration",
    ])
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
    const { template, data } = req.body;
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

/**
 * Get an application by ID, this controller would be accesible
 * only to org staff to view a cred in more detail
 *
 * @route GET /api/applications/:id
 * @returns IApplicationType
 */

const getApplicationById = asyncHandler(async (req: Request, res: Response) => {
  const application = await Application.findById(req.params.id)
    .populate("applicant", ["username"])
    .populate("template", [
      "name",
      "duration",
      "referenceCode",
      "credentialType",
    ])
    .exec();
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }
  res.json(application);
});

/**
 * Update the status of the application by modding the status
 * of the application, limited only to staff with canManageApplications
 * perm obviously
 *
 * @route PATCH /api/applications/:id
 * @returns IApplicationType
 */

const modApplicationStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }
    application.status = req.body.isApproved ? "APPROVED" : "DECLINED";
    const updated = await application.save();
    if (req.body.isApproved) {
      // TODO change this later to actual shit
      const vc = await createVerifiableCredential(
        "http://coodos.co",
        "did:iota:1231312313",
        application.data
      );
      res.json({
        application: updated,
        vc,
      });
    }
  }
);

/**
 * Get all the applications that the current user has submitted
 * to be converted into VerifiableCredentials
 *
 * @route GET /api/applications/@me/current
 */

const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
  if (req.query.id) {
    const application = await Application.findById(req.query.id)
      .populate("applicant", ["username"])
      .populate("template", [
        "name",
        "referenceCode",
        "credentialType",
        "duration",
      ])
      .exec();
    if (application) {
      res.json(application);
    } else {
      res.status(404);
      throw new Error("application not found");
    }
  } else {
    const applications = await Application.find({ applicant: req.user._id })
      .select("-data")
      .populate("applicant", ["username"])
      .populate("template", [
        "name",
        "referenceCode",
        "credentialType",
        "duration",
      ])
      .exec();
    if (!applications) {
      res.status(404);
      throw new Error("No applications found");
    }
    res.json(applications);
  }
});

export {
  indexApplications,
  createNewApplication,
  getApplicationById,
  modApplicationStatus,
  getMyApplications,
};
