import Application, { IApplicationField } from "../models/Application";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

/**
 * Create a new application template that can be used by the organisation
 * to later create forms where people can apply for verifiable credentials
 *
 * @route POST /api/applications
 * @returns Application
 */

const createNewApplication = asyncHandler(
  async (req: Request, res: Response) => {
    interface IReqBody {
      name: string;
      fields: IApplicationField[];
    }
    const { name, fields }: IReqBody = req.body;
    if (!(name && fields)) {
      res.status(400);
      throw new Error("name and fields are required");
    }
    const newApplication = await Application.create({
      name,
      fields,
    });
    res.json(newApplication);
  }
);

export { createNewApplication };
