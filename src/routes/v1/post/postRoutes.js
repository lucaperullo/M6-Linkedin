import express from "express";
import { asyncHandler } from "../../../core/asyncHandler.js";
import {
  getAllPosts,
  getAllPostsByUser,
  getPostByID,
  createNewPost,
  editPost,
  deletePost,
} from "./postControllers.js";

const router = express.Router();

// router.get('/', asyncHandler(async (req, res, next) => {

//   const users = {}

//   if (!users) next(new NotFoundError("Users not found"))

//   res.status(200).send(users)
// }))

router
  .route("/")
  .get(asyncHandler(getAllPosts))
  .post(asyncHandler(createNewPost));

router.route("/:userId").get(asyncHandler(getAllPostsByUser));

router
  .route("/:postId")
  .get(asyncHandler(getPostByID))
  .put(asyncHandler(editPost))
  .delete(asyncHandler(deletePost));

export default router;
