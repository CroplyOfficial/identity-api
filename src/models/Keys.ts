import mongoose, { Schema } from 'mongoose';
import { encrypt } from '../utils/crypto';

const KeysSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ------ custom interface -------*/

export interface KeysType extends mongoose.Document {
  publicKey: string;
  privateKey: string;
  username: string;
}

/* ------- model methods ---------*/

KeysSchema.pre('save', async function (next) {
  const self: any = this;
  self.publicKey = encrypt(self.publicKey);
  self.privateKey = encrypt(self.privateKey);
});

const Keys = mongoose.model<KeysType>('Keys', KeysSchema);

export default Keys;
