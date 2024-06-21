import Workout from "../models/workoutSchema.js";

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.status(200).json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createWorkout = async (req, res) => {
  const {
    heading,
    heading1,
    heading2,
    heading3,
    heading4,
    heading5,
    setsData, // Updated to use setsData
  } = req.body;

  const workout = new Workout({
    heading,
    heading1,
    heading2,
    heading3,
    heading4,
    heading5,
    setsData, // Assign setsData directly
  });

  try {
    const newWorkout = await workout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWorkout = async (req, res) => {
  const { setsData, ...rest } = req.body; // Destructure setsData separately

  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { ...rest, setsData }, // Spread setsData in the update
      { new: true }
    );
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
