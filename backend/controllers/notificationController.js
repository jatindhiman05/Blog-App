const Notification = require("../models/notificationSchema");

const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user;

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .populate("sender", "name username profilePic")
            .populate("blog", "title blogId")
            .populate("comment", "comment");

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false,
        });

        return res.status(200).json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("getUserNotifications error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const userId = req.user;

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error("markAsRead error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const markSingleAsRead = async (req, res) => {
    try {
        const userId = req.user;
        const { id } = req.params;

        const notification = await Notification.findOne({
            _id: id,
            recipient: userId,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        if (notification.isRead) {
            return res.status(200).json({
                success: true,
                message: "Notification already marked as read",
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        console.error("markSingleAsRead error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const userId = req.user;
        const { id } = req.params;

        const notification = await Notification.findOneAndDelete({
            _id: id,
            recipient: userId,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        console.error("deleteNotification error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user;

        const result = await Notification.deleteMany({ recipient: userId });

        return res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} notifications`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("deleteAllNotifications error:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserNotifications,
    markAsRead,
    markSingleAsRead,
    deleteNotification,
    deleteAllNotifications,
};