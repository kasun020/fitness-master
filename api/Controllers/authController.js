// controllers/authC.js
//import Register from "../models/registerSchema.js";
import Signup from "../models/signupSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const register = async (req, res) => {
  try {
    const {
      scheduleType,
      name,
      age,
      gender,
      weight,
      whatsappNumber,
      paymentSlip,
      frontBodyPicture,
      backBodyPicture,
    } = req.body;
    const newRegister = new Register({
      scheduleType,
      name,
      age,
      gender,
      weight,
      whatsappNumber,
      paymentSlip,
      frontBodyPicture,
      backBodyPicture,
    });
    await newRegister.save();
    res.status(201).send({ message: "Registration successful" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
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

// Signup a new user (admin or regular user)
export const signup = async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;

  try {
    const newUser = new Signup({ email, password, role });
    newUser.confirmPassword = confirmPassword; // Set the virtual field for validation
    await newUser.save();

    if (role === "admin") {
      res.status(201).send({ message: "Admin registered successfully" });
    } else {
      res.status(201).send({ message: "User registered successfully" });
    }
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
  const { email, password, role } = req.body;

  try {
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
    if (role) user.role = role;

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
