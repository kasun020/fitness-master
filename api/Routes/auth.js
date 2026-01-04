import express from "express";
import {
  login,
  me,
  register,
  signup,
  updateUser,
} from "../Controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/register", register);
router.get("/me", requireAuth, me);
router.put("/users/:id", requireAuth, updateUser);

export default router;
