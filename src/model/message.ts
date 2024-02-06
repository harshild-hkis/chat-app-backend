import { ObjectId, Schema, Types, model } from "mongoose";

import { UserModel } from "./user";

interface IMessage {
  from: UserModel;
  message: string;
  to: UserModel;
}

const messageSchema = new Schema<IMessage>(
  {
    from: { type: Types.ObjectId, ref: "user", required: true },
    message: { type: String, required: true },
    to: { type: Types.ObjectId, ref: "user", required: true },
  },
  {
    strict: true,
    timestamps: true,
    autoCreate: true,
  }
);

const Message = model<IMessage>("message", messageSchema);

export default Message;
