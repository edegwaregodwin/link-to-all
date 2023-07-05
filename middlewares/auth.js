import Jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.js";
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 25 //  maximum of 25 request per minute
})

export const checkHeader = async (req, res, next) => {

  limiter(req, res, next);
  const authHeader = req.headers.authorization;


export const checkHeader = async (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Invalid authorization header" });
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const user = Jwt.verify(token, process.env.JWT_TOKEN);
    if (user) {
      req.user = user;
      next();
    }
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
};

export const getHeader = async (req, res, next) => {

  limiter(req, res, next);
  const authHeader = req.headers["Authorization"];
  const userExist = await User.findById(req.params.id);

  if (!userExist) {
    return res.status(404).json({ status: 404, error: "User not found" });
  }
  if (!authHeader) {
    req.user = {
      authorised: false,
      id: userExist._id,
    };
    next();
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = Jwt.verify(token, process.env.JWT_TOKEN);
    if (user) {
      req.user = {
        authorised: true,
        id: userExist._id,
      };
      next();
    }
  } catch (err) {
    console.log(err);
    req.user = {
      authorised: false,
      id: userExist._id,
    };
    next();
  }
};
