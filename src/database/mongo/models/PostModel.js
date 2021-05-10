import mongoose from "mongoose";

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
    user: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  },
  { timestamps: true }
);

export default model("Post", postSchema);
