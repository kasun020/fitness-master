import express from "express";
import {
  signup,
  updateUser,
  deleteUser,
  getAllUser,
  getSingleUser,
} from "../Controllers/signupController.js";

const router = express.Router();

//post request //http://localhost:5000/user/signup
router.post("/signup", signup);
router.get("/:id", getSingleUser);
router.get("/get-all", getAllUser);
router.put("/:id", updateUser);
router.get("/:id", deleteUser);

export default router;
