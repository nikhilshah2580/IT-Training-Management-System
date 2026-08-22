import User from "../models/user.model.js";
import { createNotificationService } from "../services/notification.service.js";

const safeNotify = async (payload) => {
  try {
    return await createNotificationService(payload);
  } catch (error) {
    console.error("Notification delivery failed:", error.message);
    return null;
  }
};

export const notifyUser = async ({ userId, ...payload }) => {
  if (!userId) return null;

  return safeNotify({
    recipient: userId,
    ...payload,
  });
};

export const notifyAdmins = async (payload) => {
  const admins = await User.find({ role: "admin" }).select("_id");

  await Promise.allSettled(
    admins.map((admin) =>
      safeNotify({
        recipient: admin._id,
        ...payload,
      }),
    ),
  );
};

export const notifyCourseInstructor = async ({ course, ...payload }) => {
  const instructorId = course?.instructor?._id || course?.instructor;
  if (!instructorId) return null;

  return notifyUser({
    userId: instructorId,
    ...payload,
  });
};
