import e, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Application, { IApplicationType } from "../models/Applications";
import CredentialTemplate from "../models/CredentialTemplate";
import { VerifiableCredential } from "@iota/identity-wasm/node";
import {
  createVerifiableCredential,
  revokeKey,
  verifyCredential,
} from "../utils/identityUtils/vc";
import { getConfig } from "../utils/adminUtils/configUtil";

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
    const { template, data, did } = req.body;
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
        did,
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
    const application: any = await Application.findById(req.params.id)
      .populate("template")
      .exec();

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    let signingKey;
    const lastSigned = await Application.find()
      .sort({ signingKey: -1 })
      .limit(1)
      .exec();

    if (lastSigned) {
      // have to check against undefined because of the number 0
      // being a falsy value and evaluating the statement to become
      // false each time
      if (lastSigned[0].signingKey !== undefined) {
        signingKey = lastSigned[0].signingKey + 1;
      } else {
        signingKey = 0;
      }
    } else {
      signingKey = 0;
    }

    application.status = req.body.isApproved ? "APPROVED" : "DECLINED";
    application.signingKey = signingKey;
    const updated = await application.save();

    if (req.body.isApproved) {
      // TODO change this later to actual shit
      const vc = await createVerifiableCredential(
        "http://coodos.co",
        application._id,
        application.template.name,
        application.did,
        application.data,
        application.template.credentialType,
        application.template.duration,
        signingKey
      );
      application.vc = vc.toJSON();
      await application.save();
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

/**
 * Revoke a credential by revoking it's associated merkle key
 *
 * @param {ObjectId} ApplicationId
 * @route /api/applications/revoke/:id
 */

const revokeCredential = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const application = await Application.findById(req.params.id);
    // MATCH signing key against undefined because the number 0 is a
    // Falsey value and makes the expression false
    if (application && application.signingKey !== undefined) {
      await revokeKey(application?.signingKey);
      application.status = "REVOKED";
      const updated = await application.save();
      res.json(updated);
    } else {
      console.log(application);
      throw new Error("unable to revoke");
    }
  }
);

/**
 * Verify the credential posted to this route and then check
 * the credential against both the Domain AND the VC's actual
 * check
 *
 * @param {VerifiableCredential} in the body
 */

const checkCredential = asyncHandler(async (req: Request, res: Response) => {
  const cred = VerifiableCredential.fromJSON(req.body);
  const result = await verifyCredential(cred);
  res.json(result);
});

export {
  indexApplications,
  createNewApplication,
  getApplicationById,
  modApplicationStatus,
  getMyApplications,
  checkCredential,
  revokeCredential,
};
