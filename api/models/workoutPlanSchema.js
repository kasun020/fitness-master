import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number },
    reps: { type: String },
    restSeconds: { type: Number },
    notes: { type: String },
    videoUrl: { type: String },
  },
  { _id: false }
);

const workoutDaySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    dayName: { type: String },
    targetMuscles: { type: [String], default: [] },
    exercises: { type: [exerciseSchema], default: [] },
    cardio: {
      type: {
        type: String,
      },
      duration: { type: Number },
      intensity: { type: String },
    },
    notes: { type: String },
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
      index: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
    },

    planName: { type: String },
    scheduleType: {
      type: String,
      enum: ["Body Building", "Fat Burning", "Ladies", "General Fitness"],
    },
    durationWeeks: { type: Number },

    workoutDays: { type: [workoutDaySchema], default: [] },

    restDays: { type: [Number], default: [] },
    generalInstructions: { type: String },
    warmupRoutine: { type: String },
    cooldownRoutine: { type: String },

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
export default WorkoutPlan;
