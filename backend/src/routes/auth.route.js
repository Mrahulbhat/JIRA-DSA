import express from "express";
import passport from "passport";
import {
  requestOtp,
  verifyOtp,
  googleCallback,
  getCurrentUser,
  getSession,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// OTP-based Authentication
router.post("/request-otp", requestOtp);   // send OTP to phone
router.post("/verify-otp", verifyOtp);     // verify OTP & login/signup

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/login" }),
  googleCallback
);

// Check session
router.get("/session", getSession);

// Protected routes
router.get("/me", verifyToken, getCurrentUser);
router.post("/logout", logout);
router.put("/profile", verifyToken, updateProfile);

export default router;
