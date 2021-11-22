import mongoose, { Schema } from "mongoose";

const shareSchema: Schema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
    },
    participants: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

/* ------ custom interface -------*/

export interface ShareRoomType extends mongoose.Document {
  hash: string;
  participants: string[];
}

/* ------- model methods ---------*/

const ShareRoom = mongoose.model<ShareRoomType>("ShareRoom", shareSchema);

export default ShareRoom;
