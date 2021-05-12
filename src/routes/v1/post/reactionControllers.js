import mongoose from "mongoose";
import postModel from "../../../database/mongo/models/PostModel.js";
import UserModel from "../../../database/mongo/models/UserModel.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "../../../core/apiErrors.js";


export const reactionPost = async (req, res, next) => {
  const reactions = { like:"like", clap:"clap", thoughtful:"thoughtful", idea:"idea", favorite:"favorite" };
  const urlArray = req.originalUrl.split("/");
  const reaction = urlArray[urlArray.length - 1];
//   if (Object.values(reactions).includes(reaction))
    console.log(Object.entries(reactions));
    console.log(Object.values(reactions));

  const post = await postModel.findById(req.params.postId);
  if (!post[reaction].includes(req.params.userId)) {
    const editedPost = await postModel.findOneAndUpdate(
      {
        _id: req.params.postId,
      },
      {
        $push: {
            reaction: req.params.userId,
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(201).send(editedPost);
  } else {
    const deleteLike = await postModel.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: {
          likes: req.params.userId,
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(200).send(deleteLike);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.params.postId) next(new BadRequestError("This id doesn't exist"));
  const post = await postModel.findByIdAndDelete(req.params.postId);
  if (!post) next(new NotFoundError("Post not found"));
  res.status(204).send();
};
