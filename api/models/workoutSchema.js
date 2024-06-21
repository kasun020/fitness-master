import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
  sets: { type: Number },
  count: { type: Number },
});

const workoutSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  heading1: { type: String },
  heading2: { type: String },
  heading3: { type: String },
  heading4: { type: String },
  heading5: { type: String },
  setsData: [setSchema], // Array of sets
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
