import express from "express";
import {
  getMyProblems,
  addProblem,
} from "../controllers/problems.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Fetch all problems of logged-in user
router.get("/", verifyToken, getMyProblems);

// Add a problem (logged-in user)
router.post("/add", verifyToken, addProblem);

export default router;
