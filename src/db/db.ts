import mongoose from "mongoose";

export const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/chat_app")
    .then(() => {
      console.log("Database connected");
    })
    .catch((e) => {
      console.log(`Error in Database connection ${JSON.stringify(e)}`);
    });
};
