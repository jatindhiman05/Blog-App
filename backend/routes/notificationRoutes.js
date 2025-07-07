const express = require("express");
const {
    getUserNotifications,
    markAsRead,
    markSingleAsRead,
    deleteNotification,
    deleteAllNotifications
} = require("../controllers/notificationController");
const verifyUser = require("../middlewares/auth");

const route = express.Router();

// Get all notifications
route.get("/notifications", verifyUser, getUserNotifications);

// Mark all as read
route.patch("/notifications/mark-read", verifyUser, markAsRead);

// Mark single as read
route.patch("/notifications/:id/read", verifyUser, markSingleAsRead);

// Delete single notification
route.delete("/notifications/:id", verifyUser, deleteNotification);

// Delete all notifications
route.delete("/notifications", verifyUser, deleteAllNotifications);

module.exports = route;