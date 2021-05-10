import express from "express";
import asyncHandler from "../../core/asyncHandler.js";
import ExperienceModel from "../../database/mongo/models/ExperienceModel.js";

const router = express.Router();

router.get(
  "/:userId/reviews",
  asyncHandler(async (req, res, next) => {
    const experiences = await ExperienceModel.find();
    res.send(reviews);
  })
);

router.get(
  "/:userId/reviews/:reviewId",
  asyncHandler(async (req, res, next) => {
    const experience = await ExperienceModel.findById(req.params.reviewId);
    res.send(experience);
  })
);
