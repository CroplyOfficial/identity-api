import mongoose, { Schema } from "mongoose";

const applicationSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    applicationTemplate: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interface IApplicationField {
  label: string;
  type: "text" | "email" | "number" | "tel";
}

export interface ApplicationType extends mongoose.Document {
  name: string;
  applicationTemplate: IApplicationField[];
}

const Application = mongoose.model<ApplicationType>(
  "Application",
  applicationSchema
);

export default Application;
