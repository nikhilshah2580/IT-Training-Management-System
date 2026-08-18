import {
    createNotificationService,
    getMyNotificationsService,
    getNotificationService,
    markNotificationAsReadService,
    markAllNotificationsAsReadService,
    deleteNotificationService,
    deleteAllNotificationsService,
    createAdminNotificationService,
} from "../services/notification.service.js";

// GET MY NOTIFICATIONS
export const getMyNotifications = async (req, res) => {
    const result = await getMyNotificationsService(req.user._id, req.query);

    return res.status(200).json({
        success: true,
        ...result,
    });
};

// GET SINGLE NOTIFICATION
export const getNotification = async (req, res) => {
    const notification = await getNotificationService(
        req.params.id,
        req.user._id,
    );

    return res.status(200).json({
        success: true,
        notification,
    });
};

// MARK ONE AS READ
export const markNotificationAsRead = async (req, res) => {
    const notification = await markNotificationAsReadService(
        req.params.id,
        req.user._id,
    );

    return res.status(200).json({
        success: true,
        message: "Notification marked as read.",
        notification,
    });
};

// MARK ALL AS READ
export const markAllNotificationsAsRead = async (req, res) => {
    await markAllNotificationsAsReadService(req.user._id);

    return res.status(200).json({
        success: true,
        message: "All notifications marked as read.",
    });
};

// DELETE ONE
export const deleteNotification = async (req, res) => {
    await deleteNotificationService(req.params.id, req.user._id);

    return res.status(200).json({
        success: true,
        message: "Notification deleted successfully.",
    });
};

// DELETE ALL
export const deleteAllNotifications = async (req, res) => {
    await deleteAllNotificationsService(req.user._id);

    return res.status(200).json({
        success: true,
        message: "All notifications deleted successfully.",
    });
};

// ADMIN CREATE NOTIFICATION
export const createAdminNotification = async (req, res) => {
    const notification = await createAdminNotificationService({
        ...req.body,
        sender: req.user._id,
    });

    return res.status(201).json({
        success: true,
        message: "Notification created successfully.",
        notification,
    });
};
