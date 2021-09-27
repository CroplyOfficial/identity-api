import mongoose, { Schema } from "mongoose";

const roleSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    canManageCredentials: {
      type: Boolean,
      required: true,
      default: false,
    },
    canManageApplications: {
      type: Boolean,
      required: true,
      default: false,
    },
    canViewHistory: {
      type: Boolean,
      required: true,
      default: false,
    },
    canManageIdentity: {
      type: Boolean,
      required: true,
      default: false,
    },
    canManageUsers: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ------ custom interface -------*/

export interface RoleType extends mongoose.Document {
  name: string;
  canManageUsers: boolean;
  canManageIdentity: boolean;
  canViewHistory: boolean;
  canManageApplications: boolean;
  canManageCredentials: boolean;
}

/* ------- model methods ---------*/

const Role = mongoose.model<RoleType>("Role", roleSchema);

export default Role;
