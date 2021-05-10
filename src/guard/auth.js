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
        { sub: username },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: process.env.JWT_ACCESS_TIME }
      );
      res
        .send({
          message: `User created with this ID => ${newUser._id}`,
          access_token: `${access_token}`,
        })
        .status(201);
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
    const user = UserModel.findOne({
      $or: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
      password: password,
    });
    if (user) {
      const access_token = await jwt.sign(
        { sub: username },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: process.env.JWT_ACCESS_TIME }
      );
      return res.json({
        status: true,
        message: "login success",
        data: { access_token },
      });
    } else {
      res.send("User not found").status(404);
    }
  })
);

export default auth;
