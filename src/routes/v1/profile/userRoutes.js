import express from "express";
import { asyncHandler } from "../../../core/asyncHandler.js";
import { BadRequestError, NotFoundError } from "../../../core/apiErrors.js";
import UserModel from "../../../database/mongo/models/UserModel.js";
import ExperienceModel from "../../../database/mongo/models/ExperienceModel.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { extname } from "path";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const users = await UserModel.find();

    if (!users) next(new NotFoundError("User not found"));

    res.status(200).send(users);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.send(user).status(200);
    }
  })
);

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const newUser = await UserModel.create(req.body);
    res
      .send({
        message: `User created with this ID => ${newUser._id}`,
      })
      .status(201);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const updatedUser = { ...req.body };
    const user = await UserModel.findByIdAndUpdate(req.params.id, updatedUser, {
      runValidators: true,
      new: true,
    });
    if (user) {
      res.send({ message: "User updated successfully" }).status(200);
    }
  })
);
router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (user) {
      res.send({ message: "user destroyed" }).status(204);
    }
  })
);

router.get(
  "/:userId/experiences/:experienceId",
  asyncHandler(async (req, res, next) => {
    const experience = await UserModel.findById(
      {
        _id: req.params.userId,
      },
      {
        experiences: {
          $elemMatch: { _id: req.params.experienceId },
        },
      }
    );
    res.send(experience).status(200);
  })
);

router.post(
  "/:userId/experiences",
  asyncHandler(async (req, res, next) => {
    const newExperience = new ExperienceModel(req.body);
    const experience = { ...newExperience.toObject() };
    await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        $push: {
          experiences: { ...experience, created_At: new Date() },
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.send(experience).status(201);
  })
);

router.put(
  "/:userId/experiences/:experienceId",
  asyncHandler(async (req, res, next) => {
    const modifiedExperience = await UserModel.findOneAndUpdate(
      {
        _id: req.params.userId,
        "experiences._id": req.params.experienceId,
      },
      {
        $set: {
          "experiences.$": {
            ...req.body,
            _id: req.params.experienceId,
            updated_At: new Date(),
          },
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!modifiedExperience) {
      new NotFoundError(`User not found!`);
    }
    res.status(202).send(modifiedExperience);
  })
);

router.delete(
  "/:userId/experiences/:experienceId",
  asyncHandler(async (req, res, next) => {
    const modifiedUser = await UserModel.findByIdAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $pull: {
          experiences: { _id: req.params.experienceId },
        },
      },
      { new: true }
    );
    if (modifiedUser) {
      res.send("User experiences modified");
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  })
);

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "LinkedIn",
  },
});

const cloudMulter = multer({
  storage: cloudStorage,
  fileFilter: function (req, file, next) {
    const acceptedExtensions = [".png", ".jpg", ".gif", "bmp", ".jpeg"];
    if (!acceptedExtensions.includes(extname(file.originalname))) {
      return next(
        new ErrorResponse(
          `Image type not allowed: ${extname(file.originalname)}`
        )
      );
    }
    next(null, true);
  },
});

router.post(
  "/:userId/upload/:experienceId",
  asyncHandler(async (req, res, next) => {
    const modifiedUser = await UserModel.findByIdAndUpdate(
      {
        _id: req.params.userId,
        "experiences._id": req.params.experienceId,
      },
      {
        $set: {
          "experiences.$": {
            ...req.body,
            image: req.file.path,
            _id: req.params.experienceId,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );
    res.send(modifiedUser).status(202);
  })
);
export default router;
