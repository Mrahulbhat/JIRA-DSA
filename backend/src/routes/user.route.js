import express from "express";
import { listAllUsers, searchUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, listAllUsers);
router.get("/search", verifyToken, searchUsers);

export default router;
