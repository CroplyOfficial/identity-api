import mongoose, { Schema } from "mongoose";

const applicationSchema: Schema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CredentialTemplate",
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export interface IApplicationType extends mongoose.Document {
  applicant: mongoose.Schema.Types.ObjectId;
  template: mongoose.Schema.Types.ObjectId;
  data: Object;
}

const Application = mongoose.model<IApplicationType>(
  "Application",
  applicationSchema
);

export default Application;
