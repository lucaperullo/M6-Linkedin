import express from "express";
import { asyncHandler } from "../../../core/asyncHandler.js";
import {
  getAllPosts,
  getAllPostsByUser,
  getPostByID,
  createNewPost,
  editPost,
  deletePost,
  postImage,
  uploadImagePostMddw,
} from "./postControllers.js";

const router = express.Router();

router.route("/").get(asyncHandler(getAllPosts)); // Ok

router
  .route("/:userId")
  .get(asyncHandler(getAllPostsByUser)) //  Ok
  .post(uploadImagePostMddw.single("imagePost"), asyncHandler(createNewPost)); // Ok

router
  .route("/:postId/user/:userId")
  .post(uploadImagePostMddw.single("imagePost"), asyncHandler(postImage)) // Ok
  .get(asyncHandler(getPostByID)) //Ok
  .put(asyncHandler(editPost)) // Ok
  .delete(asyncHandler(deletePost)); // Ok

export default router;
