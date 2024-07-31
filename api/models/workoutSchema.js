import mongoose from "mongoose";
const Schema = mongoose.Schema;

// const exerciseSchema = new Schema({
//   exname: { type: String, required: true },
//   sets: { type: Number, required: true },
//   count: { type: Number, required: true },
// });

const workoutSchema = new Schema({
  scheduleType: {
    type: String,
    required: true,
    enum: ["Body Building", "Fat Burning", "Ladies"],
  },
  Username: { type: String, required: true }, // Name instead of Date
  Instructions: { type: String, required: true }, // Instructions instead of Date
  // bodyParts: {
  //   // Array of body parts
  //   type: [String],
  //   required: true,
  //   enum: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Abs"], // Predefined body parts
  // },
  // exercises: [exerciseSchema], // Array of exercise
  // day: {
  //   type: Number,
  //   required: false,
  //   enum: ["1", "2", "3"],
  // },
  day1workout: {
    type: String,
    required: true,
  },
  day2workout: {
    type: String,
    required: false,
  },
  day3workout: {
    type: String,
    required: false,
  },
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
