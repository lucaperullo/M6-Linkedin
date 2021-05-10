import jwt from "jsonwebtoken";
import express from "express";

const auth = express.Router();
auth.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const access_token = jwt.sign(
      { sub: username },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    return res.send(access_token);
  }
});

