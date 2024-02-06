import mongoose from "mongoose";

export const connect = () => {
  mongoose
    .connect("mongodb+srv://chatapp:chatapp@cluster0.ilrizhb.mongodb.net/")
    .then(() => {
      console.log("Database connected");
    })
    .catch((e) => {
      console.log(`Error in Database connection ${JSON.stringify(e)}`);
    });
};
