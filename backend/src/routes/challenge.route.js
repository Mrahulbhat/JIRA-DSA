import express from "express";
import {
  createChallenge,
  getMyChallenges,
  completeChallenge,
  getPendingCount,
} from "../controllers/challenge.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createChallenge);
router.get("/pending-count", verifyToken, getPendingCount);
router.get("/", verifyToken, getMyChallenges);
router.patch("/:id/complete", verifyToken, completeChallenge);

export default router;
