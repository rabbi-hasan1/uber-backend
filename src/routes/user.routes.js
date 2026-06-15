import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller.js";
const router = Router();
router.post(
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

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters"),
  ],
  userController.login,
);
export default router;
