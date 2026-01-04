import express from "express";
import {
  createDietPlan,
  deleteDietPlan,
  getDietPlan,
  getMyDietPlan,
  updateDietPlan,
} from "../Controllers/dietPlanController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: create diet plan for a registration
router.post(
  "/create/:registrationId",
  requireAuth,
  requireAdmin,
  createDietPlan
);

// User: get my diet plan
router.get("/me", requireAuth, getMyDietPlan);

// Admin or owner: get by id
router.get("/:id", requireAuth, getDietPlan);

// Admin: update
router.put("/update/:id", requireAuth, requireAdmin, updateDietPlan);

// Admin: delete
router.delete("/:id", requireAuth, requireAdmin, deleteDietPlan);

export default router;
