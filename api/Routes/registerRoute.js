import express from "express";
import {
  createRegistration,
  getSingleRegistration,
  getAllRegistrations,
  updateRegistration,
  deleteRegistration,
} from "../Controllers/registerController.js";

import multer from "multer";

// Configure multer storage
const storage = multer.memoryStorage(); // Using memory storage for buffers
const upload = multer({ storage: storage });

const router = express.Router();

// Create a new registration
router.post(
  "/add",
  upload.fields([
    { name: "paymentSlip", maxCount: 1 },
    { name: "frontBodyPicture", maxCount: 1 },
    { name: "backBodyPicture", maxCount: 1 },
  ]),
  createRegistration
);

// Get a single registration by ID
router.get("/:id", getSingleRegistration);

// Get all registrations
router.get("/", getAllRegistrations);

// Update a registration by ID
router.put("/update/:id", updateRegistration);

// Delete a registration by ID
router.delete("/:id", deleteRegistration);

// POST route to add a workout for a user
router.post("/add-workout/:userId", async (req, res) => {
  try {
    const {
      scheduleType,
      Username,
      Instructions,
      day1workout,
      day2workout,
      day3workout,
    } = req.body;
    const userId = req.params.userId;

    // Validate if the user exists
    const user = await Register.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new workout
    const newWorkout = new Workout({
      scheduleType: scheduleType,
      Username: Username,
      Instructions: Instructions,
      day1workout: day1workout,
      day2workout: day2workout,
      day3workout: day3workout,
    });

    // Save the workout
    const savedWorkout = await newWorkout.save();

    // Update user's workouts array
    user.workouts.push(savedWorkout._id);
    await user.save();

    res
      .status(201)
      .json({ message: "Workout added successfully", workout: savedWorkout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET route to fetch all workouts for a user
router.get("/get-workouts/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Register.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workouts = await Workout.find({ Username: user.name });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
