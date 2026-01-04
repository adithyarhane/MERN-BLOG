import express from "express";
import {
  login,
  logout,
  register,
  sendVerificationOtp,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);
authRouter.route("/send-verification-otp").post(userAuth, sendVerificationOtp);

export default authRouter;
