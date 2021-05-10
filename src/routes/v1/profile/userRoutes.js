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
  "/me",
  asyncHandler(async (req, res, next) => {
    const key = req.headers.authorization.split(" ")[1];
    const users = await UserModel.findOne();
    axios.get("http://localhost:5000/users/");
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
  "/:userId/experiences",
  asyncHandler(async (req, res, next) => {
    const { experiences } = await UserModel.findById(req.params.userId);
    res.send(experiences).status(200);
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
      new NotFoundError(`User not found!`);
    }
    res.send("User experiences modified");
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
  cloudMulter.single("image"),
  asyncHandler(async (req, res, next) => {
    const modifiedUser = await UserModel.findByIdAndUpdate(
      {
        _id: req.params.userId,
        "experiences._id": req.params.experienceId,
      },
      {
        $set: {
          "experiences.$": {
            image: req.file.path,
            _id: req.params.experienceId,
            updated_At: new Date(),
          },
        },
      },
      { runValidators: true, new: true }
    );
    res.status(202).send(modifiedUser);

    if (!modifiedUser) {
      new BadRequestError(`Error while uploading picture`);
    }

    res.status(201).send(modifiedUser);
  })
);
export default router;
