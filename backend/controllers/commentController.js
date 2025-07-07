const Blog = require("../models/blogSchema");
const sendNotification = require("../utils/sendNotification");
const Comment = require("../models/commentSchema");

async function addComment(req, res) {
    try {
        const creator = req.user;
        const { id: blogId } = req.params;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({
                message: "Please enter a comment",
            });
        }

        const blog = await Blog.findById(blogId).populate("creator", "_id name");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        // Create the comment
        const newComment = await Comment.create({
            comment,
            blog: blogId,
            user: creator,
        }).then((c) =>
            c.populate({
                path: "user",
                select: "name email username profilePic",
            })
        );

        await Blog.findByIdAndUpdate(blogId, {
            $push: { comments: newComment._id },
        });

        // Send notification if not commenting on own blog
        if (creator.toString() !== blog.creator._id.toString()) {
            await sendNotification({
                req,
                recipientId: blog.creator._id,
                senderId: creator,
                type: "comment",
                blogId: blog._id,
                commentId: newComment._id,
                message: `commented on your blog "${blog.title}"`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            newComment,
        });
    } catch (error) {
        console.error("Add comment error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
}


async function deleteComment(req, res) {
    try {
        const userId = req.user;
        const { id } = req.params;

        const comment = await Comment.findById(id).populate({
            path: "blog",
            select: "creator",
        });

        if (!comment) {
            return res.status(500).json({
                message: "Comment not found",
            });
        }

        if (comment.user != userId && comment.blog.creator != userId) {
            return res.status(500).json({
                message: "You are not authorized",
            });
        }

        async function deleteCommentAndReplies(id) {
            let comment = await Comment.findById(id);

            for (let replyId of comment.replies) {
                await deleteCommentAndReplies(replyId);
            }

            if (comment.parentComment) {
                await Comment.findByIdAndUpdate(comment.parentComment, {
                    $pull: { replies: id },
                });
            }

            await Comment.findByIdAndDelete(id);
        }

        await deleteCommentAndReplies(id);

        await Blog.findByIdAndUpdate(comment.blog._id, {
            $pull: { comments: id },
        });

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function editComment(req, res) {
    try {
        const userId = req.user;
        const { id } = req.params;
        const { updatedCommentContent } = req.body;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(500).json({
                message: "Comment is not found",
            });
        }

        if (comment.user != userId) {
            return res.status(400).json({
                success: false,
                message: "You are not valid user to edit this comment",
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            {
                comment: updatedCommentContent,
            },
            { new: true }
        ).then((comment) => {
            return comment.populate({
                path: "user",
                select: "name email",
            });
        });

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            updatedComment,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function likeComment(req, res) {
    try {
        const userId = req.user;
        const { id: commentId } = req.params;

        const comment = await Comment.findById(commentId).populate("user", "_id name");

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        const isLiked = comment.likes.includes(userId);

        if (!isLiked) {
            await Comment.findByIdAndUpdate(commentId, { $push: { likes: userId } });

            // Send notification if user is not liking their own comment
            if (userId.toString() !== comment.user._id.toString()) {
                await sendNotification({
                    req,
                    recipientId: comment.user._id,
                    senderId: userId,
                    type: "comment-like",
                    commentId: comment._id,
                    blogId: comment.blog, 
                    message: "liked your comment",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Comment liked successfully",
                isLiked: true,
            });
        } else {
            await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });

            return res.status(200).json({
                success: true,
                message: "Comment unliked successfully",
                isLiked: false,
            });
        }
    } catch (error) {
        console.error("likeComment error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
}


async function addNestedComment(req, res) {
    try {
        const userId = req.user;
        const { id: blogId, parentCommentId } = req.params;
        const { reply } = req.body;

        if (!reply || reply.trim() === "") {
            return res.status(400).json({
                message: "Reply cannot be empty",
            });
        }

        const parentComment = await Comment.findById(parentCommentId).populate("user", "_id name");
        const blog = await Blog.findById(blogId);

        if (!parentComment) {
            return res.status(404).json({
                message: "Parent comment not found",
            });
        }

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        const newReply = await Comment.create({
            blog: blogId,
            comment: reply,
            parentComment: parentCommentId,
            user: userId,
        }).then((replyDoc) =>
            replyDoc.populate({
                path: "user",
                select: "name email profilePic",
            })
        );

        await Comment.findByIdAndUpdate(parentCommentId, {
            $push: { replies: newReply._id },
        });

        // Send notification to parent comment author (if not replying to self)
        if (userId.toString() !== parentComment.user._id.toString()) {
            await sendNotification({
                req,
                recipientId: parentComment.user._id,
                senderId: userId,
                type: "reply",
                blogId,
                commentId: parentCommentId,
                message: "replied to your comment",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reply added successfully",
            newReply,
        });
    } catch (error) {
        console.error("addNestedComment error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
}


module.exports = {
    addComment,
    deleteComment,
    editComment,
    likeComment,
    addNestedComment,
};
