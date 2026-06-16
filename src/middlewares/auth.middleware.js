import jwt from "jsonwebtoken";
import blacklistToken from "../models/blacklistToke.model.js";
import captainModel from "../models/captain.model.js";
import UserModel from "../models/user.model.js";

const checkAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const isBlacklisted = await blacklistToken.findOne({ token: token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

export const checkAuthCaptain = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const isBlacklisted = await blacklistToken.findOne({ token: token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const captain = await captainModel.findById(decoded._id);

    if (!captain) {
      return res.status(401).json({
        message: "captain not found",
      });
    }

    req.captain = captain;

    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

export default checkAuth;
