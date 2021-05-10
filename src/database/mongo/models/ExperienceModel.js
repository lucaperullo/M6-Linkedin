import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ExperienceSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      minLength: [3, "Minimum length should be 5 characters"],
      maxLength: [20, "Maximum length should be 20 characters"],
    },
    company: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [5, "Minimum length should be 5 characters"],
    },
    area: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://www.mindmeister.com/blog/wp-content/uploads/2019/03/Document-Writing.png",
    },
  },
  { timestamps: true }
);

export default model("Experience", ExperienceSchema);
