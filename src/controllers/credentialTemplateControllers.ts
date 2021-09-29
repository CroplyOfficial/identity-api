import CredentialTemplate, {
  ICredentialField,
} from "../models/CredentialTemplate";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

/**
 * Create a new application template that can be used by the organisation
 * to later create forms where people can apply for verifiable credentials
 *
 * @route POST /api/cred-templates
 * @returns Application
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
 * Edit a credential template to modify the fields/name of the
 * credential template
 *
 * @route PATCH /api/cred-templates/:id
 * @returns Application
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

export { createNewCredentialTemplate, editCredentialTemplate };
