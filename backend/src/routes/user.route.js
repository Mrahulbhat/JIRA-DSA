import express from "express";
import { listAllUsers, searchUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { deleteMyAccount } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", verifyToken, listAllUsers);
router.get("/search", verifyToken, searchUsers);

//to delete a user
router.delete('/me',verifyToken,deleteMyAccount);

export default router;
