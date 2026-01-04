import express from "express";
import {
  createWorkoutPlan,
  deleteWorkoutPlan,
  getMyWorkoutPlan,
  getWorkoutPlan,
  updateWorkoutPlan,
} from "../Controllers/workoutPlanController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: create workout plan for a registration
router.post(
  "/create/:registrationId",
  requireAuth,
  requireAdmin,
  createWorkoutPlan
);

// User: get my workout plan
router.get("/me", requireAuth, getMyWorkoutPlan);

// Admin or owner: get by id
router.get("/:id", requireAuth, getWorkoutPlan);

// Admin: update
router.put("/update/:id", requireAuth, requireAdmin, updateWorkoutPlan);

// Admin: delete
router.delete("/:id", requireAuth, requireAdmin, deleteWorkoutPlan);

export default router;
