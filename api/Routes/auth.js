import express from "express";
import {
  signup,
  login,
  register,
  updateUser,
} from "../Controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/register", register);
router.put("/users/:id", updateUser);

export default router;
