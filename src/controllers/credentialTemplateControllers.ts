import CredentialTemplate, {
  ICredentialField,
} from "../models/CredentialTemplate";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

/**
 * Get all the credential templates stored in the database and return the
 * relevant pieces of information that are needed to list stuff
 *
 * @route GET /api/cred-templates
 * @returns Array<CredentialTemplate>
 */

const indexCredentialTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    CredentialTemplate.find()
      .select([
        "name",
        "status",
        "referenceCode",
        "credentialType",
        "createdAt",
      ])
      .exec()
      .then((credentials) => {
        res.json(credentials);
      });
  }
);

/**
 * Create a new credential template that can be used by the organisation
 * to later create forms where people can apply for verifiable credentials
 *
 * @route POST /api/cred-templates
 * @returns CredentialTemplate
 */

const createNewCredentialTemplate = asyncHandler(
  async (req: Request, res: Response) => {
    interface IReqBody {
      name: string;
      referenceCode: string;
      credentialType: "License" | "Certificate" | "Ticket";
      duration: number;
      fields: ICredentialField[];
    }
    const { name, referenceCode, credentialType, duration, fields }: IReqBody =
      req.body;
    if (!(name && fields)) {
      res.status(400);
      throw new Error("name and fields are required");
    }
    const newCredentialTemplate = await CredentialTemplate.create({
      name,
      referenceCode,
      credentialType,
      duration,
      fields,
    });
    res.json(newCredentialTemplate);
  }
);

/**
 * Delete a credential template and return the deleted object
 *
 * @route DELETE /api/cred-templates/:id
 * @returns CredentialTemplate
 */

const deleteCredentialTemplate = asyncHandler(
  async (req: Request, res: Response) => {
    const deletedCredential = await CredentialTemplate.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCredential) {
      res.status(404);
      throw new Error("CredentialTemplate not found");
    }
    res.json(deletedCredential);
  }
);

/**
 * Get a specific credential template by ID
 *
 * @route GET /api/cred-templates/:id
 * @returns CredentialTemplate
 */

const getCredentialTemplateById = asyncHandler(
  async (req: Request, res: Response) => {
    const credentialTemplate = await CredentialTemplate.findById(req.params.id);
    if (!credentialTemplate) {
      res.status(404);
      throw new Error("CredentialTemplate not found");
    }
    res.json(credentialTemplate);
  }
);

/**
 * Edit a credential template to modify the fields/name of the
 * credential template
 *
 * @route PATCH /api/cred-templates/:id
 * @returns CredentialTemplate
 */

const editCredentialTemplate = asyncHandler(
  async (req: Request, res: Response) => {
    interface IReqBody {
      name: string;
      referenceCode: string;
      credentialType: "License" | "Certificate" | "Ticket";
      duration: number;
      fields: ICredentialField[];
    }
    const credentialTemplate = await CredentialTemplate.findById(req.params.id);
    const {
      name,
      referenceCode,
      credentialType,
      duration,
      fields,
    }: Partial<IReqBody> = req.body;
    if (!credentialTemplate) {
      res.status(404);
      throw new Error("Application not found");
    }
    credentialTemplate.name = name || credentialTemplate.name;
    credentialTemplate.fields = fields || credentialTemplate.fields;
    credentialTemplate.referenceCode =
      referenceCode || credentialTemplate.referenceCode;
    credentialTemplate.credentialType =
      credentialType || credentialTemplate.credentialType;
    credentialTemplate.duration = duration || credentialTemplate.duration;

    const updated = await credentialTemplate.save();
    res.json(updated);
  }
);

export {
  createNewCredentialTemplate,
  editCredentialTemplate,
  indexCredentialTemplates,
  getCredentialTemplateById,
  deleteCredentialTemplate,
};
