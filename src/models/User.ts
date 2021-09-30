import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    isStaff: {
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

export interface UserType extends mongoose.Document {
  username: string;
  password: string;
  pin: string;
  role: mongoose.Schema.Types.ObjectId;
  isStaff: boolean;
}

/* ------- model methods ---------*/

userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const self: any = this;
  return await bcrypt.compare(enteredPassword, self.password);
};

userSchema.methods.matchPin = async function (
  enteredPin: string
): Promise<boolean> {
  const self: any = this;
  if (self.pin) {
    return await bcrypt.compare(enteredPin, self.pin);
  } else {
    return false;
  }
};

userSchema.pre("save", async function (next) {
  const self: any = this;
  if (!self.isModified("password")) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    self.password = await bcrypt.hash(self.password, salt);
    if (self.pin && self.pin !== undefined) {
      self.pin = await bcrypt.hash(self.pin, salt);
    }
  }
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
