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
      type: Object,
    },
    privateKey: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

/* ------ custom interface -------*/

export interface KeysType extends mongoose.Document {
  publicKey: any;
  privateKey: any;
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
