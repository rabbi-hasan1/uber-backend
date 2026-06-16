import { validationResult } from "express-validator";
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

const captainController = {
  registerCaptain,
};
export default captainController;
