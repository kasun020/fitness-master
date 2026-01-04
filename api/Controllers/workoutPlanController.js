import Register from "../models/registerSchema.js";
import WorkoutPlan from "../models/workoutPlanSchema.js";
import { createNotification } from "./notificationController.js";

function isOwnerOrAdmin(req, resourceUserId) {
  if (req.user?.role === "admin") return true;
  return String(resourceUserId) === String(req.user?.id);
}

export const createWorkoutPlan = async (req, res) => {
  try {
    const registration = await Register.findById(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    const payload = req.body || {};

    const workoutPlan = new WorkoutPlan({
      userId: registration.userId,
      registrationId: registration._id,
      createdBy: req.user.id,

      planName: payload.planName,
      scheduleType: payload.scheduleType || registration.scheduleType,
      durationWeeks: payload.durationWeeks,

      workoutDays: payload.workoutDays || [],
      restDays: payload.restDays || [],
      generalInstructions: payload.generalInstructions,
      warmupRoutine: payload.warmupRoutine,
      cooldownRoutine: payload.cooldownRoutine,

      status: payload.status || "active",
    });

    await workoutPlan.save();

    await Register.findByIdAndUpdate(
      registration._id,
      { workoutPlan: workoutPlan._id },
      { new: false }
    );

    if (workoutPlan.status === "active") {
      await createNotification({
        userId: registration.userId,
        type: "plan_assigned",
        title: "Workout plan assigned",
        message: "Your workout plan is ready. Open the app to view it.",
        link: "/workout",
      });
    }

    return res
      .status(201)
      .json({ message: "Workout plan created successfully", workoutPlan });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id);
    if (!workoutPlan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    if (!isOwnerOrAdmin(req, workoutPlan.userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.status(200).json(workoutPlan);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMyWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({
      userId: req.user.id,
      status: { $ne: "archived" },
    }).sort({ createdAt: -1 });

    if (!workoutPlan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    return res.status(200).json(workoutPlan);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!workoutPlan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    if (workoutPlan.status === "active") {
      await createNotification({
        userId: workoutPlan.userId,
        type: "plan_updated",
        title: "Workout plan updated",
        message: "Your workout plan was updated. Open the app to view changes.",
        link: "/workout",
      });
    }

    return res
      .status(200)
      .json({ message: "Workout plan updated successfully", workoutPlan });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findByIdAndDelete(req.params.id);
    if (!workoutPlan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    await Register.findByIdAndUpdate(
      workoutPlan.registrationId,
      { $unset: { workoutPlan: 1 } },
      { new: false }
    );

    return res
      .status(200)
      .json({ message: "Workout plan deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
