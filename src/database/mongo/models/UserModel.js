import mongoose from "mongoose";
import ExperienceModel from "./ExperienceModel";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: "A name is required",
  },
  surname: {
    type: String,
    required: "A surname is required",
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  bio: {},
  experiences: [ExperienceModel],
});

export default model("user", UserSchema);
