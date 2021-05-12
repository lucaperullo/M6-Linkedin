import mongoose from "mongoose";
import { CommentSchema } from "./CommentModel.js";

const { Schema, model } = mongoose;

// const LikeSchema = new Schema({
//   userId: { type: mongoose.Types.ObjectId, ref: "User" },
// });

// const ClapSchema = new Schema(
//   {
//     userId: { type: mongoose.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// const ThoughtfulSchema = new Schema(
//   {
//     userId: { type: mongoose.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// const FavoritesSchema = new Schema(
//   {
//     userId: { type: mongoose.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

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
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    comments: [CommentSchema],
    likes: [],
    claps: [],
    thoughtful: [],
    favorites: [],
  },
  { timestamps: true }
);

export default model("Post", postSchema);
