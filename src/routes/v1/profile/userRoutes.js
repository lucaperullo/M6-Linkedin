import express from "express";
import { asyncHandler } from "../../../core/asyncHandler.js";
import { BadRequestError, NotFoundError } from "../../../core/apiErrors.js";
import UserModel from "../../../database/mongo/models/UserModel.js";

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

export default router;
