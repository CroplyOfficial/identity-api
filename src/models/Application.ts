import mongoose, { Schema } from "mongoose";

const applicationSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export interface IApplicationField {
  label: string;
  type: "text" | "email" | "number" | "tel";
}

export interface ApplicationType extends mongoose.Document {
  name: string;
  fields: IApplicationField[];
}

const Application = mongoose.model<ApplicationType>(
  "Application",
  applicationSchema
);

export default Application;
