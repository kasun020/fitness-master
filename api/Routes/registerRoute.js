import express from 'express';
import {
  createRegistration,
  getSingleRegistration,
  getAllRegistrations,
  updateRegistration,
  deleteRegistration,
} from '../Controllers/registerController.js';

import multer from 'multer';

// Configure multer storage
const storage = multer.memoryStorage(); // Using memory storage for buffers
const upload = multer({ storage: storage });

const router = express.Router();

// Create a new registration
router.post(
  '/add',
  upload.fields([
    { name: 'paymentSlip', maxCount: 1 },
    { name: 'frontBodyPicture', maxCount: 1 },
    { name: 'backBodyPicture', maxCount: 1 },
  ]),
  createRegistration
);

// Get a single registration by ID
router.get('/:id', getSingleRegistration);

// Get all registrations
router.get('/', getAllRegistrations);

// Update a registration by ID
router.put('/update/:id', updateRegistration);

// Delete a registration by ID
router.delete('/:id', deleteRegistration);

export default router;
