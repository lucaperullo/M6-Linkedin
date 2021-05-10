import jwt from "jsonwebtoken";
import express from "express";
import UserModel from "../database/mongo/models/UserModel.js";

const auth = express.Router();

auth.post("/login", async (req, res) => {
  console.log({ user: req.body.username, pw: req.body.password });
  const username = req.body.username;
  const password = req.body.password;
  const user = UserModel.findOne({ username: username, password: password });
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
});

export default auth;
