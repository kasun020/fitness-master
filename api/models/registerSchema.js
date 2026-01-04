import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Cloudinary storage
  url: {
    type: String,
  },
  publicId: {
    type: String,
  },
  // Legacy in-DB storage (kept for existing documents)
  img: {
    data: Buffer,
    contentType: String,
  },
});

const registerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
      index: true,
    },
    scheduleType: {
      type: String,
      required: true,
      enum: ["Body Building", "Fat Burning", "Ladies"],
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
    },
    fitnessGoal: {
      type: String,
    },
    medicalConditions: {
      type: String,
    },
    dietaryRestrictions: {
      type: String,
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
    paymentSlip: {
      type: imageSchema,
      required: true,
    },
    frontBodyPicture: {
      type: imageSchema,
      required: true,
    },
    backBodyPicture: {
      type: imageSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "approved",
      index: true,
    },
    adminNotes: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
    },
    reviewedAt: {
      type: Date,
    },
    // Reference to the workouts
    workouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],
    // Future: these will reference new plan models once implemented
    dietPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DietPlan",
    },
    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
    },
  },
  {
    timestamps: true,
  }
);

const RegisterModel = mongoose.model("Register", registerSchema);

export default RegisterModel;
