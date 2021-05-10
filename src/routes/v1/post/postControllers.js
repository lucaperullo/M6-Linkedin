import express from "express";
import q2m from "query-to-mongo";
import mongoose from 'mongoose';
import postModel from "../../../database/mongo/models/PostModel.js";
import { BadRequestError, NotFoundError } from "../../../core/apiErrors.js";

//This get all posts should be to populate the feed
export const getAllPosts = async (req, res, next) => {
    const posts = await postModel.find().populate("user");
    res.status(200).send(posts); 
};

export const getAllPostsByUser = async (req, res, next) => {

    const postsByUser = await postModel.findById(req.params.postId);
    if (!postsByUser) next(new NotFoundError("Nothing posted yet from this user"))
    res.status(200).send(postsByUser)
};

export const getPostByID = async (req, res, next) => {
    const post = await postModel.findById(req.params.postId);
    if (!post) next(new NotFoundError("Post not found"))
    res.status(200).send(post)
};
export const createNewPost = async (req, res, next) => {};
export const editPost = async (req, res, next) => {};
export const deletePost = async (req, res, next) => {};
