import User, { ensureUsername } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../middleware/auth.js";
import redisClient from '../config/redis.js'; 

// Register user
export const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Validation
    if (!phone || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, phone, and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone: phone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Create new user
    const user = new User({
      name,
      phone: phone,
      password,
    });

    await user.save();
    await ensureUsername(user);

    // Generate JWT token
    const token = generateToken(user._id, user.phone);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone and password",
      });
    }

    // Check if user exists and get password field
    const user = await User.findOne({
      phone: phone,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    await ensureUsername(user);

    // Generate JWT token
    const token = generateToken(user._id, user.phone);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Google OAuth callback - generate JWT
export const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    // Generate JWT token
    const token = generateToken(req.user._id, req.user.phone);

    // Set token in cookie and redirect to frontend with token
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.redirect(`${frontendURL}/login?token=${token}`);
  } catch (error) {
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendURL}/login?error=auth_failed`);
  }
};

// Check user session (for backward compatibility with frontend)
export const getSession = async (req, res) => {
  try {
    // Try to get token from Authorization header or cookies
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
      let user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user = await ensureUsername(user);

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          phone: user.phone,
        },
      });
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    let user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user = await ensureUsername(user);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout
export const logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");
  
  // Also clear session if using passport sessions
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

// Request OTP
export const requestOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  // Store in Redis for 5 minutes
  await redisClient.setEx(`otp:${phone}`, 300, otp);

  console.log(`OTP for ${phone}: ${otp}`); // In production, send via SMS
  res.status(200).json({ success: true, message: 'OTP sent' });
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP required' });

  const storedOtp = await redisClient.get(`otp:${phone}`);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
  }

  // OTP is valid, delete from Redis
  await redisClient.del(`otp:${phone}`);
  res.status(200).json({
    success: true,
    message: 'OTP verified',
  });
};

// Update profile for OTP users (set name/password after first login)
export const updateProfile = async (req, res) => {
  try {
    const { name, password, weeklyGoal } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = password; // will be hashed by pre-save hook
    }
    if (typeof weeklyGoal === "number" && weeklyGoal >= 0) {
      user.weeklyGoal = weeklyGoal;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

