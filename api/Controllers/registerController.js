import Register from "../models/registerSchema.js";
import Signup from "../models/signupSchema.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

// Create a new registration
export const createRegistration = async (req, res) => {
  try {
    const {
      scheduleType,
      name,
      age,
      gender,
      weight,
      whatsappNumber,
      height,
      fitnessGoal,
      medicalConditions,
      dietaryRestrictions,
      experienceLevel,
    } = req.body;
    const files = req.files;

    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log(
      `[register] createRegistration start name="${name}" scheduleType="${scheduleType}"`
    );

    if (
      !files?.paymentSlip?.[0] ||
      !files?.frontBodyPicture?.[0] ||
      !files?.backBodyPicture?.[0]
    ) {
      return res.status(400).json({ error: "Missing required images" });
    }

    const [paymentSlipUpload, frontUpload, backUpload] = await Promise.all([
      uploadBufferToCloudinary(files.paymentSlip[0], {
        folder: "fitness-master/payment-slips",
      }),
      uploadBufferToCloudinary(files.frontBodyPicture[0], {
        folder: "fitness-master/body-pictures",
      }),
      uploadBufferToCloudinary(files.backBodyPicture[0], {
        folder: "fitness-master/body-pictures",
      }),
    ]);

    console.log(
      `[register] cloudinary uploads ok paymentSlip=${paymentSlipUpload.publicId} front=${frontUpload.publicId} back=${backUpload.publicId}`
    );

    const registration = new Register({
      userId: req.user.id,
      scheduleType,
      name,
      age,
      gender,
      weight,
      height,
      fitnessGoal,
      medicalConditions,
      dietaryRestrictions,
      experienceLevel,
      whatsappNumber,
      // No approval step: treat new submissions as approved by default.
      status: "approved",
      paymentSlip: {
        name:
          paymentSlipUpload.originalFilename ||
          files.paymentSlip[0].originalname,
        url: paymentSlipUpload.url,
        publicId: paymentSlipUpload.publicId,
      },
      frontBodyPicture: {
        name:
          frontUpload.originalFilename ||
          files.frontBodyPicture[0].originalname,
        url: frontUpload.url,
        publicId: frontUpload.publicId,
      },
      backBodyPicture: {
        name:
          backUpload.originalFilename || files.backBodyPicture[0].originalname,
        url: backUpload.url,
        publicId: backUpload.publicId,
      },
    });

    await registration.save();

    // Mark profile complete + link registration to user account
    await Signup.findByIdAndUpdate(
      req.user.id,
      {
        profileCompleted: true,
        registrationId: registration._id,
        fullName: name,
        phone: whatsappNumber,
      },
      { new: false }
    );

    console.log(`[register] createRegistration saved id=${registration._id}`);
    res
      .status(201)
      .json({ message: "Registration created successfully", registration });
  } catch (err) {
    console.error(`[register] createRegistration failed`, err);
    res.status(500).json({ error: err.message });
  }
};

// Get current user's registration
export const getMyRegistration = async (req, res) => {
  try {
    const registration = await Register.findOne({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    return res.status(200).json(registration);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: list registrations pending review
export const getPendingRegistrations = async (req, res) => {
  try {
    // Backward-compatible: old dashboard called this "pending".
    // With the new flow, treat pending/under_review/approved as "approved list".
    const registrations = await Register.find({
      status: { $in: ["approved", "pending", "under_review"] },
    }).sort({ createdAt: -1 });
    return res.status(200).json(registrations);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: list approved registrations
export const getApprovedRegistrations = async (req, res) => {
  try {
    const registrations = await Register.find({
      status: { $in: ["approved", "pending", "under_review"] },
    }).sort({ createdAt: -1 });
    return res.status(200).json(registrations);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: list rejected registrations
export const getRejectedRegistrations = async (req, res) => {
  try {
    const registrations = await Register.find({ status: "rejected" }).sort({
      createdAt: -1,
    });
    return res.status(200).json(registrations);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: update registration status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Missing status" });
    }

    if (!["pending", "under_review", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const registration = await Register.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    return res
      .status(200)
      .json({ message: "Status updated successfully", registration });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get a single registration by ID
export const getSingleRegistration = async (req, res) => {
  try {
    const registration = await Register.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.status(200).json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all registrations
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Register.find({});
    res.status(200).json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a registration by ID
export const updateRegistration = async (req, res) => {
  try {
    const registration = await Register.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res
      .status(200)
      .json({ message: "Registration updated successfully", registration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a registration by ID
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Register.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.status(200).json({ message: "Registration deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
