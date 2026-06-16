import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";
const userRouter = Router();
userRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invaild Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("first name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters long"),
  ],
  userController.register,
);

userRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters"),
  ],
  userController.login,
);

userRouter.get("/logout", checkAuth, userController.logout);

userRouter.get("/getProfile", checkAuth, userController.getProfile);
export default userRouter;
