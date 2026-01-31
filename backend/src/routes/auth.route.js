import express from "express";
import passport from "passport";
import {
  googleCallback,
  getCurrentUser,
  getSession,
  logout,
  updateProfile,
  register,
  login,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Email/Phone + Password auth
router.post("/register", register);
router.post("/login", login);

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

// Session check (token-based)
router.get("/session", getSession);

// Protected routes
router.get("/me", verifyToken, getCurrentUser);
router.post("/logout", logout);
router.put("/profile", verifyToken, updateProfile);

export default router;
