import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "registration_approved",
        "registration_rejected",
        "plan_assigned",
        "plan_updated",
        "reminder",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false, index: true },
    link: { type: String },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
