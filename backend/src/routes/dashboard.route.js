import express from "express";
import { getDashboardStats, getFeed, getProblemOfTheDay } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);
router.get("/feed", verifyToken, getFeed);
router.get("/problem-of-the-day", verifyToken, getProblemOfTheDay);

export default router;
