import Notification from "../models/notificationSchema.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort(
      {
        createdAt: -1,
      }
    );
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    return res.status(200).json(notification);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );
    return res
      .status(200)
      .json({ message: "All notifications marked as read" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Internal helper for other controllers
export const createNotification = async ({
  userId,
  type,
  title,
  message,
  link,
}) => {
  const notification = new Notification({
    userId,
    type,
    title,
    message,
    link,
  });
  await notification.save();
  return notification;
};
