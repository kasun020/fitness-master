// controllers/authC.js
// import Register from "../models/registerSchema.js";
import Signup from "../models/signupSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
// export const register = async (req, res) => {
//   try {
//     const {
//       scheduleType,
//       name,
//       age,
//       gender,
//       weight,
//       whatsappNumber,
//       paymentSlip,
//       frontBodyPicture,
//       backBodyPicture,
//     } = req.body;
//     const newRegister = new Register({
//       scheduleType,
//       name,
//       age,
//       gender,
//       weight,
//       whatsappNumber,
//       paymentSlip,
//       frontBodyPicture,
//       backBodyPicture,
//     });
//     await newRegister.save();
//     res.status(201).send({ message: "Registration successful" });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// };

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, { httpOnly: true });
    res
      .status(200)
      .send({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Signup a new user
export const signup = async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;

  try {
    const newUser = new Signup({ email, password, role });
    newUser.confirmPassword = confirmPassword; // Set the virtual field for validation
    await newUser.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get a single user by ID
export const getSingleUser = async (req, res) => {
  try {
    const user = await Signup.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get all users
export const getAllUser = async (req, res) => {
  try {
    const users = await Signup.find({}).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Signup.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).send({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await Signup.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
