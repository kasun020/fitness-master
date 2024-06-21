import express from "express";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../Controllers/workoutController.js";

const router = express.Router();

router.get("/", getWorkouts);
router.post("/create-workout", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
