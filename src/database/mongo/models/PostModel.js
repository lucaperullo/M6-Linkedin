import mongoose from "mongoose";
import { CommentSchema } from "./CommentModel.js";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default model("Post", postSchema);
