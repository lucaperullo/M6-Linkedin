import jwt from "jsonwebtoken";
import express from "express";
import { truncateSync } from "node:fs";

const auth = express.Router();

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: true,
      message: "Your session is not valid",
      data: error,
    });
  }
}

auth.post("/login", verifyToken, (req, res) => {
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

export default auth;
