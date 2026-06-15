import { validationResult } from "express-validator";
import UserModel from "../models/user.model.js";
import userService from "../services/user.service.js";

async function register(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { fullname, email, password } = req.body;

    const hashPassword = await UserModel.hashPassword(password);

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashPassword,
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isMath = await user.comparePassword(password);
    if (!isMath) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const token = user.generateAuthToken();
    res.status(200).json({ token, user });
  } catch (error) {}
}

const userController = {
  register,
  login,
};
export default userController;
