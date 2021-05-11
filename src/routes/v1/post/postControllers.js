import express from "express";
import q2m from "query-to-mongo";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { extname } from "path";
import mongoose from "mongoose";
import postModel from "../../../database/mongo/models/PostModel.js";
import UserModel from "../../../database/mongo/models/UserModel.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "../../../core/apiErrors.js";

//This get all posts should be to populate the feed // Missing pagination here!!!!!!
export const getAllPosts = async (req, res, next) => {
  const posts = await postModel.find().populate("user");
  res.status(200).send(posts);
};

export const getAllPostsByUser = async (req, res, next) => {
  if (!req.params.userId)
    next(new BadRequestError("Opps! seems this user doesn't exists"));
  const postsByUser = await postModel.find({
    userId: mongoose.Types.ObjectId(req.params.userId),
  });
  if (!postsByUser)
    next(new NotFoundError("Nothing posted yet from this user"));
  res.status(200).send(postsByUser);
};
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "LinkedIn",
  },
});

export const uploadImagePostMddw = multer({
  storage: cloudStorage,
  fileFilter: function (req, file, next) {
    if (file) {
      const acceptedExtensions = [".png", ".jpg", ".gif", "bmp", ".jpeg"];
      if (!acceptedExtensions.includes(extname(file.originalname))) {
        return next(
          new ErrorResponse(
            `Image type not allowed: ${extname(file.originalname)}`
          )
        );
      }
    } else {
      next(null, true);
    }
  },
});

export const createNewPost = async (req, res, next) => {
  if (!req.params.userId)
    next(
      new BadRequestError("only user registered can post, user need to have ID")
    );
  if (!req.file) {
    const post = { ...req.body, userId: req.params.userId };
    const newPost = new postModel(post);
    await newPost.save();
    res.status(201).send(newPost);
  } else {
    const post = { ...req.body, userId: req.params.userId, img: req.file.path };
    const newPost = new postModel(post);
    await newPost.save();
    res.status(201).send(newPost);
  }
};

export const postImage = async (req, res, next) => {
  const isUser = await UserModel.findById(req.params.userId);
  if (!isUser)
    next(
      new UnauthorizedError(
        `Sorry you need to specified your credentials, user._id. in order to post image`
      )
    );
  const oldPost = await postModel.findById(req.params.postId);
  if (!oldPost)
    next(
      new BadRequestError(
        `Wrong postId please check it in order to add imageURL`
      )
    );
  oldPost.toObject();
  if (req.params.userId != oldPost.userId)
    next(
      new ForbiddenError(
        `Sorry you are not allow to Post Image in behalf of ${oldPost.username}`
      )
    );
  const addingImageURL = await postModel.findOneAndUpdate(
    {
      _id: req.params.postId,
    },
    {
      $set: {
        img: req.file.path,
      },
    },
    { new: true }
  );

  if (!addingImageURL)
    next(
      new BadRequestError(
        `Opps! Error while uploading Post Image, seems this post doesn't exist`
      )
    );
  res.status(201).send(addingImageURL);
};

export const getPostByID = async (req, res, next) => {
  const post = await postModel.findById(req.params.postId);
  if (!post) next(new NotFoundError("Post not found"));
  res.status(200).send(post);
};

export const editPost = async (req, res, next) => {
  const post = await postModel.findByIdAndUpdate(req.params.postId, req.body, {
    runValidators: true,
    new: true,
  });
  if (!post) next(new NotFoundError("Post not found"));

  res.status(200).send(post);
};

export const deletePost = async (req, res, next) => {
  if (!req.params.postId) next(new BadRequestError("This id doesn't exist"));
  const post = await postModel.findByIdAndDelete(req.params.postId);
  if (!post) next(new NotFoundError("Post not found"));
  res.status(204).send();
};
