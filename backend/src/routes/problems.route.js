import express from "express";
import {
  getMyProblems,
  getProblemById,
  addProblem,
  updateProblem,
} from "../controllers/problems.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Fetch all problems of logged-in user
router.get("/", verifyToken, getMyProblems);

// Get single problem (owner only)
router.get("/:id", verifyToken, getProblemById);

// Add a problem (logged-in user)
router.post("/add", verifyToken, addProblem);

// Update a problem (owner only)
router.patch("/:id", verifyToken, updateProblem);

export default router;
