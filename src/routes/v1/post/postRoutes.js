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
} from "./postControllers.js";

const router = express.Router();

router.route("/").get(asyncHandler(getAllPosts)); // Ok

router
  .route("/:userId")
  .get(asyncHandler(getAllPostsByUser)) //  Ok
  .post(asyncHandler(createNewPost)) // Ok
  .post(asyncHandler(postImage)); // *

router
  .route("/:postId/user/:userId")
  .get(asyncHandler(getPostByID)) //Ok
  .put(asyncHandler(editPost)) // Ok
  .delete(asyncHandler(deletePost)); // Ok

// *****************COMMENTS ROUTES ***************

router.route("/:userId/:postId/comments").get(asyncHandler(getAllComments));

export default router;
