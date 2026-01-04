// controllers/authC.js
//import Register from "../models/registerSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Signup from "../models/signupSchema.js";

// NOTE: Registration submissions with images are handled under /register (registerController).

// Register a new user
export const register = async (req, res) => {
  return res.status(410).json({
    error:
      "This endpoint is deprecated. Use POST /register/add with multipart/form-data to submit user details and images.",
  });
};

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
        // expiresIn: "24h",
      }
    );

    res.cookie("token", token, { httpOnly: true });

    const message =
      user.role === "admin"
        ? "Admin login successful"
        : "User login successful";

    res.status(200).send({ message, token, role: user.role });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Signup a new user (always role=user). Admin accounts are created via seed script.
export const signup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const newUser = new Signup({ email, password, role: "user" });
    newUser.confirmPassword = confirmPassword; // Set the virtual field for validation
    await newUser.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get currently authenticated user (id + role)
export const me = async (req, res) => {
  try {
    const user = await Signup.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
  const { email, password, role } = req.body;

  try {
    if (!req.user?.id) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const isAdmin = req.user.role === "admin";
    const isSelf = String(req.user.id) === String(req.params.id);

    if (!isAdmin && !isSelf) {
      return res.status(403).send({ error: "Forbidden" });
    }

    const user = await Signup.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    // Only admins can change roles.
    if (role && isAdmin) user.role = role;

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
