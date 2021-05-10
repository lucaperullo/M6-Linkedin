import express from "express";
import { asyncHandler } from "../../../core/asyncHandler.js";
import {
  getAllPosts,
  getAllPostsByUser,
  getPostByID,
  createNewPost,
  editPost,
  deletePost,
  postImage
} from "./postControllers.js";

const router = express.Router();


router.route("/").get(asyncHandler(getAllPosts));

router
  .route("/:userId")
  .get(asyncHandler(getAllPostsByUser))
  .post(asyncHandler(createNewPost))
  .post(asyncHandler(postImage));

router
  .route("/:postId/user/:userId")
  .get(asyncHandler(getPostByID))
  .put(asyncHandler(editPost))
  .delete(asyncHandler(deletePost));

export default router;
