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
<<<<<<< HEAD
=======
  uploadImagePostMddw,
>>>>>>> 650fdb4d56e71c2430220ace79dbaf594fc6fb1f
} from "./postControllers.js";

const router = express.Router();

router.route("/").get(asyncHandler(getAllPosts)); // Ok

router
  .route("/:userId")
  .get(asyncHandler(getAllPostsByUser)) //  Ok
<<<<<<< HEAD
  .post(asyncHandler(createNewPost)) // Ok
  .post(asyncHandler(postImage)); // *
=======
  .post(uploadImagePostMddw.single("imagePost"), asyncHandler(createNewPost)); // Ok
>>>>>>> 650fdb4d56e71c2430220ace79dbaf594fc6fb1f

router
  .route("/:postId/user/:userId")
  .post(uploadImagePostMddw.single("imagePost"), asyncHandler(postImage)) // Ok
  .get(asyncHandler(getPostByID)) //Ok
  .put(asyncHandler(editPost)) // Ok
  .delete(asyncHandler(deletePost)); // Ok

// *****************COMMENTS ROUTES ***************

router.route("/:userId/:postId/comments").get(asyncHandler(getAllComments));

export default router;
