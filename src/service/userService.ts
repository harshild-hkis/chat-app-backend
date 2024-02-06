import bcrypt from "bcrypt";
import User from "../model/user";
import { Types } from "mongoose";
import Message from "../model/message";

interface Payload {
  userName: string;
  password: string;
}

interface InsertMessagePayload {
  from: Types.ObjectId;
  message: string;
  to: Types.ObjectId;
}

export const normalizeError = (error: any) =>
  JSON.stringify(error.message || error);

export const createOrCheck = async (payload: Payload) => {
  try {
    const already = await User.findOne({ userName: payload.userName });

    let checkIsValid = true,
      userId: Types.ObjectId | null = null;

    if (already) {
      checkIsValid = bcrypt.compareSync(payload.password, already.password);
      userId = already._id;
    } else {
      const user = await new User({
        userName: payload.userName,
        password: bcrypt.hashSync(payload.password, 10),
      }).save();
      userId = user._id;
    }

    if (checkIsValid)
      return {
        userId,
        success: true,
      };

    return {
      message: "Invalid password",
      success: false,
    };
  } catch (error) {
    return {
      message: normalizeError(error),
      success: false,
    };
  }
};

export const insertMessage = async (payload: InsertMessagePayload) => {
  try {
    await new Message(payload).save();
  } catch (error) {
    console.log(error);
    return normalizeError(error);
  }
};

export const getAllUser = async (userId: string) => {
  try {
    return await User.find({ _id: { $ne: userId } });
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.log(error);
    return null;
  }
};
