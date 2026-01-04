import express from "express";
import {
  getUserNotifications,
  markAllAsRead,
  markAsRead,
} from "../Controllers/notificationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getUserNotifications);
router.put("/read/:id", requireAuth, markAsRead);
router.put("/read-all", requireAuth, markAllAsRead);

export default router;
