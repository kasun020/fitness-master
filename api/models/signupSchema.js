import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const signupSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for confirmPassword
signupSchema
  .virtual("confirmPassword")
  .set(function (confirmPassword) {
    this._confirmPassword = confirmPassword;
  })
  .get(function () {
    return this._confirmPassword;
  });

// Password hashing before saving the user
signupSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  if (user.password !== user._confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;

  next();
});

// Method to compare passwords
signupSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Signup = mongoose.model("Signup", signupSchema);

export default Signup;
