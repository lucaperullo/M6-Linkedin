import express from "express";
import asyncHandler from "../../core/asyncHandler.js";
import ExperienceModel from "../../database/mongo/models/ExperienceModel.js";
import UserModel from "../../database/mongo/models/UserModel.js";

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

router.post(
  "/userId",
  asyncHandler(async (req, res, next) => {
    const newExperience = new ExperienceModel(req.body);
    const experience = { ...newExperience.toObject };
    await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        $push: {
          experiences: { ...experience },
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.send(experience);
  })
);
