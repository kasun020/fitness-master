import Register from "../models/registerSchema.js";

// Create a new registration
export const createRegistration = async (req, res) => {
  try {
    const { scheduleType, name, age, gender, weight, whatsappNumber } =
      req.body;
    const files = req.files;

    const registration = new Register({
      scheduleType,
      name,
      age,
      gender,
      weight,
      whatsappNumber,
      paymentSlip: {
        name: files.paymentSlip[0].originalname,
        img: {
          data: files.paymentSlip[0].buffer,
          contentType: files.paymentSlip[0].mimetype,
        },
      },
      frontBodyPicture: {
        name: files.frontBodyPicture[0].originalname,
        img: {
          data: files.frontBodyPicture[0].buffer,
          contentType: files.frontBodyPicture[0].mimetype,
        },
      },
      backBodyPicture: {
        name: files.backBodyPicture[0].originalname,
        img: {
          data: files.backBodyPicture[0].buffer,
          contentType: files.backBodyPicture[0].mimetype,
        },
      },
    });

    await registration.save();
    res
      .status(201)
      .json({ message: "Registration created successfully", registration });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
