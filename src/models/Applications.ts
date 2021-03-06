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
    status: {
      type: String,
      required: true,
      enum: ["APPROVED", "DECLINED", "PENDING", "REVOKED"],
      default: "PENDING",
    },
    vc: {
      type: Object,
    },
    signingKey: {
      type: Number,
    },
    did: {
      type: String,
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
  status: "APPROVED" | "DECLINED" | "PENDING" | "REVOKED";
  signingKey?: number;
  vc?: Object;
}

const Application = mongoose.model<IApplicationType>(
  "Application",
  applicationSchema
);

export default Application;
