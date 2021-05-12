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
  const urlArray = req.originalUrl.split("/");
  const reaction = urlArray[urlArray.length - 1];

  const finalReaction = reaction === "thoughtful" ? reaction : reaction + "s";

  const post = await postModel.findById(req.params.postId);

  const newArray = `${finalReaction}`;

  if (!post[finalReaction].includes(req.params.userId)) {
    const editedPost = await postModel.findOneAndUpdate(
      {
        _id: req.params.postId,
      },
      {
        $push: {
          [newArray]: req.params.userId,
        },
      },
      {
        $group: {
          userId: {
            total: $post[newArray],
          },
          count: { $sum: 1 },
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    const numberOfLikes = editedPost.aggregate.count("likes");
    console.log(numberOfLikes, "AAAAAAAAAAAAAAAAAAAAAAAA");
    res.status(201).send(editedPost);
  } else {
    const deleteLike = await postModel.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: {
          [newArray]: req.params.userId,
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

export const countReactions = async (req, res, next) => {};

export const deletePost = async (req, res, next) => {
  if (!req.params.postId) next(new BadRequestError("This id doesn't exist"));
  const post = await postModel.findByIdAndDelete(req.params.postId);
  if (!post) next(new NotFoundError("Post not found"));
  res.status(204).send();
};
