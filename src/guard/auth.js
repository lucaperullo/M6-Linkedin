import jwt from "jsonwebtoken";
import express from "express";
import UserModel from "../database/mongo/models/UserModel.js";
import { asyncHandler } from "../core/asyncHandler.js";

const auth = express.Router();
auth.post(
  "/register", //creating a new user
  asyncHandler(async (req, res, next) => {
    const newUser = await UserModel.create(req.body);
    if (newUser) {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      const access_token = await jwt.sign(
        { sub: newUser._id },
        process.env.JWT_ACCESS_TOKEN
      );
      res.status(201).send({
        message: `User created with this ID => ${newUser._id}`,
        access_token: `${access_token}`,
      });
    }
  })
);
auth.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    console.log({ user: req.body.username, pw: req.body.password });
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // const check = await UserModel.find({ password: password });
    // const check1 = await UserModel.find({ email: email });
    // const check2 = await UserModel.find({ username: username });
    // const user = (check1 || check2) && check;

    const user = await UserModel.find({
      $and: [
        { $or: [{ username: req.body.username }, { email: req.body.email }] },
        { password: req.body.password },
      ],
    });
    if (user.length === 1) {
      const access_token = await jwt.sign(
        { sub: user },
        process.env.JWT_ACCESS_TOKEN
      );
      return res.json({
        status: true,
        message: "login success",
        data: { access_token },
      });
    } else {
      res.status(404).send("User not found");
    }
  })
);

export default auth;
