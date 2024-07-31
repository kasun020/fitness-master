import express from "express";
import {
  createRegistration,
  getSingleRegistration,
  getAllRegistrations,
  updateRegistration,
  deleteRegistration,
} from "../Controllers/registerController.js";

import multer from "multer";

import Workout from "../models/workoutSchema.js";
import Register from "../models/registerSchema.js";

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
router.get("/get-workouts/:workoutId", async (req, res) => {
  try {
    const workoutId = req.params.workoutId;


    // Fetch workouts associated with the user
    const workouts = await Workout.find({ _id: workoutId });

    // Return the workouts
    res.status(200).json(workouts);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update a workout by ID
router.put("/update-workout/:workoutId", async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { 
      scheduleType, 
      Username, 
      Instructions, 
      day1workout, 
      day2workout, 
      day3workout 
    } = req.body;

    // Find the workout by ID and update it
    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      {
        scheduleType,
        Username,
        Instructions,
        day1workout,
        day2workout,
        day3workout,
      },
      { new: true } // Returns the updated workout document
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout updated successfully", workout: updatedWorkout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
