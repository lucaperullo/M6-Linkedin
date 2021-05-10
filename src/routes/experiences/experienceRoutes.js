import express from "express";
import asyncHandler from "../../core/asyncHandler.js";
import ExperienceModel from "../../database/mongo/models/ExperienceModel.js";
import UserModel from "../../database/mongo/models/UserModel.js";

const router = express.Router();

router.get(
  "/:userId/experiences",
  asyncHandler(async (req, res, next) => {
    const experiences = await ExperienceModel.find();
    res.send(reviews);
  })
);

router.get(
  "/:userId/experiences/:experienceId",
  asyncHandler(async (req, res, next) => {
    const experience = await ExperienceModel.findById(req.params.experienceId);
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

router.put(
  "/:userId/experiences/:experienceId",
  asyncHandler(async (req, res, next) => {
    const modifiedExperience = await ExperienceModel.findByIdAndUpdate(
      {
        _id: req.params.experienceId,
        "experiences._id": req.params.experienceId,
      },
      {
        $set: {
          "experiences.$": {
            ...req.body,
            _id: req.params.experienceId,
            updatedAt: new Date(),
          },
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    if (modifiedExperience) {
      res.send(modifiedExperience);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  })
);
