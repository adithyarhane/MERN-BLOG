import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../config/nodemailer.js";
import generateOtp from "../utils/generateOtp.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details." });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Sending Welcome Email
    const subject = "Welcome to Mernblog ✨";
    const message = `✨ Welcome to Mernblog Website. Your account has been created with email id: ${email}`;

    sendEmail(email, subject, message);

    res.json({ success: true, user: { user } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password." });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, user: { user } });
  } catch (error) {
    return res.status(500).json({ success: fale, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "node" : "strict",
    });

    return res.json({ success: false, message: "Logged Out!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendVerificationOtp = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findOne({ _id: userId });

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified." });
    }

    const otp = generateOtp();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 1 * 60 * 60 * 1000;

    await user.save();

    const email = user.email;
    const subject = "🔐 Account Verification OTP";
    const message = `Your OTP is ${otp}. Verify you account using this OTP.`;

    sendEmail(email, subject, message);
    return res.json({
      success: true,
      message: "Verification OTP Send on your email.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyAccount = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;

  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Missing required details.",
    });
  }

  try {
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "🔍 User not found.",
      });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Invalid OTP. Please try again.",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(410).json({
        success: false,
        message: "⚠️ OTP expired.",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "✅ Email verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required." });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Sending Reset otp
    const subject = "🔑 Password Reset OTP";
    const message = `OTP For resetting your password is ${otp} Use this OTP to process with resetting your password.`;

    sendEmail(email, subject, message);

    return res.json({
      success: true,
      message: "Reset OTP sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
