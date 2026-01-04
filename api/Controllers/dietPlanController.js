import DietPlan from "../models/dietPlanSchema.js";
import Register from "../models/registerSchema.js";
import { createNotification } from "./notificationController.js";

function isOwnerOrAdmin(req, resourceUserId) {
  if (req.user?.role === "admin") return true;
  return String(resourceUserId) === String(req.user?.id);
}

export const createDietPlan = async (req, res) => {
  try {
    const registration = await Register.findById(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    const payload = req.body || {};

    const dietPlan = new DietPlan({
      userId: registration.userId,
      registrationId: registration._id,
      createdBy: req.user.id,
      dailyCalories: payload.dailyCalories,
      mealsPerDay: payload.mealsPerDay,
      meals: payload.meals || [],
      supplements: payload.supplements || [],
      hydration: payload.hydration,
      restrictions: payload.restrictions || [],
      generalNotes: payload.generalNotes,
      status: payload.status || "active",
    });

    await dietPlan.save();

    await Register.findByIdAndUpdate(
      registration._id,
      { dietPlan: dietPlan._id },
      { new: false }
    );

    if (dietPlan.status === "active") {
      await createNotification({
        userId: registration.userId,
        type: "plan_assigned",
        title: "Diet plan assigned",
        message: "Your diet plan is ready. Open the app to view it.",
        link: "/diet",
      });
    }

    return res
      .status(201)
      .json({ message: "Diet plan created successfully", dietPlan });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);
    if (!dietPlan) {
      return res.status(404).json({ error: "Diet plan not found" });
    }

    if (!isOwnerOrAdmin(req, dietPlan.userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.status(200).json(dietPlan);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMyDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOne({
      userId: req.user.id,
      status: { $ne: "archived" },
    }).sort({ createdAt: -1 });

    if (!dietPlan) {
      return res.status(404).json({ error: "Diet plan not found" });
    }

    return res.status(200).json(dietPlan);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!dietPlan) {
      return res.status(404).json({ error: "Diet plan not found" });
    }

    if (dietPlan.status === "active") {
      await createNotification({
        userId: dietPlan.userId,
        type: "plan_updated",
        title: "Diet plan updated",
        message: "Your diet plan was updated. Open the app to view changes.",
        link: "/diet",
      });
    }

    return res
      .status(200)
      .json({ message: "Diet plan updated successfully", dietPlan });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findByIdAndDelete(req.params.id);
    if (!dietPlan) {
      return res.status(404).json({ error: "Diet plan not found" });
    }

    // Best-effort unlink from registration
    await Register.findByIdAndUpdate(
      dietPlan.registrationId,
      { $unset: { dietPlan: 1 } },
      { new: false }
    );

    return res.status(200).json({ message: "Diet plan deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
