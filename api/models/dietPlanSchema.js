import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String },
    quantity: { type: String },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
  },
  { _id: false }
);

const mealSchema = new mongoose.Schema(
  {
    mealType: {
      type: String,
      enum: [
        "Morning Drink",
        "Breakfast",
        "Morning Snack",
        "Lunch",
        "Evening Snack",
        "Dinner",
        "Pre-Workout",
        "Post-Workout",
      ],
    },
    time: { type: String },
    foods: { type: [foodSchema], default: [] },
    notes: { type: String },
  },
  { _id: false }
);

const supplementSchema = new mongoose.Schema(
  {
    name: { type: String },
    dosage: { type: String },
    timing: { type: String },
  },
  { _id: false }
);

const dietPlanSchema = new mongoose.Schema(
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

    dailyCalories: { type: Number },
    mealsPerDay: { type: Number },

    meals: { type: [mealSchema], default: [] },

    supplements: { type: [supplementSchema], default: [] },

    hydration: {
      dailyWaterLiters: { type: Number },
      notes: { type: String },
    },

    restrictions: { type: [String], default: [] },
    generalNotes: { type: String },

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
export default DietPlan;
