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

export default router;