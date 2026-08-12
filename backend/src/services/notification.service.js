import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { emitNotification } from "../socket/socket.js";

const throwError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};


// CREATE NOTIFICATION

export const createNotificationService = async ({
    recipient,
    sender = null,
    title,
    message,
    type = "system",
    referenceId = null,
    referenceModel = null,
}) => {
    if (!recipient) {
        throwError("Recipient is required.", 400);
    }

    if (!title || !message) {
        throwError("Title and message are required.", 400);
    }

    const user = await User.findById(recipient).select("_id");

    if (!user) {
        throwError("Recipient user not found.", 404);
    }

    if (sender) {
        const senderUser = await User.findById(sender).select("_id");

        if (!senderUser) {
            throwError("Sender user not found.", 404);
        }
    }

    const notification = await Notification.create({
        recipient,
        sender,
        title,
        message,
        type,
        referenceId,
        referenceModel,
    });

    return await Notification.findById(notification._id)
        .populate("recipient", "fullName email photo role")
        .populate("sender", "fullName email photo role");
};


// GET MY NOTIFICATIONS

export const getMyNotificationsService = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const skip = (page - 1) * limit;

    const filter = {
        recipient: userId,
    };

    if (unreadOnly === true || unreadOnly === "true") {
        filter.isRead = false;
    }

    const [notifications, total] = await Promise.all([
        Notification.find(filter).populate("sender", "fullName email photo role").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

        Notification.countDocuments(filter),
    ]);

    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
    });

    return {
        notifications,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        unreadCount,
    };
};


// GET SINGLE NOTIFICATION

export const getNotificationService = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId,
    })
        .populate("sender", "fullName email photo role")
        .populate("recipient", "fullName email photo role");

    if (!notification) {
        throwError("Notification not found.", 404);
    }

    return notification;
};


//MARK ONE AS READ

export const markNotificationAsReadService = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId,
    });

    if (!notification) {
        throwError("Notification not found.", 404);
    }

    if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();

        await notification.save();
    }

    return notification;
};


// MARK ALL AS READ

export const markAllNotificationsAsReadService = async (userId) => {
    await Notification.updateMany(
        {
            recipient: userId,
            isRead: false,
        },
        {
            $set: {
                isRead: true,
                readAt: new Date(),
            },
        },
    );

    return true;
};


//DELETE NOTIFICATION

export const deleteNotificationService = async (notificationId, userId) => {
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
    });

    if (!notification) {
        throwError("Notification not found.", 404);
    }

    return notification;
};


//DELETE ALL MY NOTIFICATIONS

export const deleteAllNotificationsService = async (userId) => {
    const result = await Notification.deleteMany({
        recipient: userId,
    });

    return result;
};

//  ADMIN CREATE NOTIFICATION

export const createAdminNotificationService = async ({ recipient, title, message, type, referenceId, referenceModel, sender }) => {
    return await createNotificationService({
        recipient,
        sender,
        title,
        message,
        type,
        referenceId,
        referenceModel,
    });
};
