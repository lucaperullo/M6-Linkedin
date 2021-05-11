import express from "express";
import q2m from "query-to-mongo";
import mongoose from "mongoose";
import postModel from "../../../database/mongo/models/PostModel.js";
import { BadRequestError, NotFoundError } from "../../../core/apiErrors.js";

//This get all posts should be to populate the feed
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

export const createNewPost = async (req, res, next) => {
  if (!req.params.userId)
    next(
      new BadRequestError("only user registered can post, user need to have ID")
    );
  const post = { ...req.body, userId: req.params.userId };
  const newPost = new postModel(post);
  await newPost.save();
  res.status(201).send(newPost);
};

export const postImage = async (req, res, next) => {};

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
