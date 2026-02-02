import express from "express";
import {
  createChallenge,
  getMyChallenges,
  completeChallenge,
  getPendingCount,
  deleteChallenge,
} from "../controllers/challenge.controller.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createChallenge);
router.get("/pending-count", verifyToken, getPendingCount);
router.get("/", verifyToken, getMyChallenges);
router.patch("/:id/complete", verifyToken, completeChallenge);
router.delete("/:id", verifyToken, deleteChallenge);


export default router;
