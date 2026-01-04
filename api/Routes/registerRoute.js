import express from "express";
import {
  createRegistration,
  deleteRegistration,
  getAllRegistrations,
  getApprovedRegistrations,
  getMyRegistration,
  getPendingRegistrations,
  getRejectedRegistrations,
  getSingleRegistration,
  updateRegistration,
  updateRegistrationStatus,
} from "../Controllers/registerController.js";

import { requireAdmin } from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";

import multer from "multer";

// Configure multer storage
const storage = multer.memoryStorage(); // Using memory storage for buffers
const upload = multer({ storage: storage });

const router = express.Router();

// Create a new registration
router.post(
  "/add",
  requireAuth,
  upload.fields([
    { name: "paymentSlip", maxCount: 1 },
    { name: "frontBodyPicture", maxCount: 1 },
    { name: "backBodyPicture", maxCount: 1 },
  ]),
  createRegistration
);

// User: get my registration
router.get("/me", requireAuth, getMyRegistration);

// Admin: registrations pending review
router.get("/pending", requireAuth, requireAdmin, getPendingRegistrations);

// Admin: approved registrations
router.get("/approved", requireAuth, requireAdmin, getApprovedRegistrations);

// Admin: rejected registrations
router.get("/rejected", requireAuth, requireAdmin, getRejectedRegistrations);

// Admin: update registration status
router.patch(
  "/:id/status",
  requireAuth,
  requireAdmin,
  updateRegistrationStatus
);

// Get a single registration by ID
router.get("/:id", getSingleRegistration);

// Get all registrations
router.get("/", getAllRegistrations);

// Update a registration by ID
router.put("/update/:id", updateRegistration);

// Delete a registration by ID
router.delete("/:id", deleteRegistration);

export default router;
