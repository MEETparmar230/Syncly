import { Router } from "express";
import { getUserStatus } from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth";

const router = Router()

router.get("/:userId/status", authMiddleware, getUserStatus);

export default router;