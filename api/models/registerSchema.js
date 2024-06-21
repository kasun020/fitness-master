import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  img: {
    data: Buffer,
    contentType: String
  }
});

const registerSchema = new mongoose.Schema({
  scheduleType: {
    type: String,
    required: true,
    enum: ["Body Building", "Fat Burning", "Ladies"]
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"]
  },
  weight: {
    type: Number,
    required: true
  },
  whatsappNumber: {
    type: String,
    required: true
  },
  paymentSlip: {
    type: imageSchema,
    required: true
  },
  frontBodyPicture: {
    type: imageSchema,
    required: true
  },
  backBodyPicture: {
    type: imageSchema,
    required: true
  }
});

const RegisterModel = mongoose.model("Register", registerSchema);

export default RegisterModel;
