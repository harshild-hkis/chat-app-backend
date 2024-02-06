import mongoose, { HydratedDocument, Schema } from "mongoose";

interface IUser {
  userName: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    strict: true,
    timestamps: true,
    autoCreate: true,
  }
);

const User = mongoose.model<IUser>("user", userSchema);

export type UserModel = HydratedDocument<IUser>

export default User;
