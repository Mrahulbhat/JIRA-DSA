import express from "express";
import { getLeaderboard } from "../controllers/leaderboard.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getLeaderboard);

export default router;
