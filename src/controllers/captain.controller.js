import { validationResult } from "express-validator";
import blacklistToken from "../models/blacklistToke.model.js";
import captainModel from "../models/captain.model.js";
import createCaptain from "../services/captain.service.js";

async function registerCaptain(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { fullname, email, password, vehicle } = req.body;
  const isCaptainAlreayExits = await captainModel.findOne({ email });
  if (isCaptainAlreayExits) {
    return res.status(400).json({
      message: "captain already exist",
    });
  }
  const hashPassword = await captainModel.hashPassword(password);
  const captain = await createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  const token = captain.generateAuthToken();
  res.status(201).json({
    token,
    captain,
  });
}

async function loginCaptain(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ message: "Invalide email or password" });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalide email or password" });
    }
    const token = captain.generateAuthToken();
    res.cookie("token", token);

    res.status(200).json({ token, captain });
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
}

async function getProfile(req, res) {
  return res.status(200).json({ captain: req.captain });
}

async function logoutCaptain(req, res) {
  const token = req.cookies.token || req.headers.Authorization?.split("")[1];
  if (!token) {
    return res.status(401).json({ message: "unAuthorized" });
  }
  await blacklistToken.create({ token });
  res.clearCookie("token");
  res.status(200).json({ message: "logout successfully" });
}

const captainController = {
  registerCaptain,
  loginCaptain,
  getProfile,
  logoutCaptain,
};
export default captainController;
