import express from "express";
import {getDashboardStats} from "../controllers/leaderboard.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getDashboardStats);

export default router;
