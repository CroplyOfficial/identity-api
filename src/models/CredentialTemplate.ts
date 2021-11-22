import mongoose, { Schema } from "mongoose";

const credentialTemplateSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    referenceCode: {
      type: String,
      required: true,
    },
    credentialType: {
      type: String,
      required: true,
      enum: ["License", "Certificate", "Ticket"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    fields: {
      type: [
        {
          label: { type: String, required: true },
          type: {
            type: String,
            required: true,
            enum: ["text", "email", "number", "tel", "date"],
          },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export interface ICredentialField {
  label: string;
  type: "text" | "email" | "number" | "tel" | "date";
}

export interface CrednetialTemplateType extends mongoose.Document {
  name: string;
  referenceCode: string;
  credentialType: "License" | "Certificate" | "Ticket";
  duration: number;
  fields: ICredentialField[];
}

const CrednetialTemplate = mongoose.model<CrednetialTemplateType>(
  "CredentialTemplate",
  credentialTemplateSchema
);

export default CrednetialTemplate;
