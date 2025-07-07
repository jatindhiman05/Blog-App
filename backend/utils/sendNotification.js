const Notification = require("../models/notificationSchema");

const sendNotification = async ({
    req,
    recipientId,
    senderId,
    type,
    blogId = null,
    commentId = null,
    message = "",
}) => {
    try {
        if (recipientId.toString() === senderId.toString()) return;

        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            blog: blogId,
            comment: commentId,
            message,
        });

        const populatedNotification = await Notification.findById(notification._id)
            .populate("sender", "name username profilePic")
            .populate("blog", "title blogId")
            .populate("comment", "comment")
            .exec();

        const { io, connectedUsers } = req.app;
        const socketId = connectedUsers[recipientId.toString()];

        if (socketId) {
            io.to(socketId).emit("newNotification", populatedNotification);

            const unreadCount = await Notification.countDocuments({
                recipient: recipientId,
                isRead: false
            });
            io.to(socketId).emit("unreadCountUpdate", unreadCount);
        }

        return populatedNotification;
    } catch (error) {
        console.error("Error in sendNotification:", error.message);
        throw error; 
    }
};

module.exports = sendNotification;