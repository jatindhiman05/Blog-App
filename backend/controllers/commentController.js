const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");

async function addComment(req, res) {
    try {
        const creator = req.user;
        const { id } = req.params;
        const { comment } = req.body;

        console.log(comment);
        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment cannot be empty" });
        }
        const blog = await Blog.findById(id);
        console.log(blog)

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        const newComment = await Comment.create({
            comment,
            blog: id,
            user: creator,
        });


        const addComment = await Blog.findByIdAndUpdate(id, {
            $push: { comments: newComment._id }
        })
        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error adding comment", error: error.message });
    }
}

async function deleteComment(req, res) {
    try {
        const userId = req.user;
        const { id } = req.params;

        const comment = await Comment.findById(id).populate({
            path: 'blog',
            select: 'creator'
        });
        console.log(comment, userId, comment.user, comment.blog.creator)
        if (!comment) {
            return res.status(500).json({
                message: "Comment not found",
            })
        }

        if (comment.user !== userId && comment.blog.creator != userId) {
            return res.status(500).json({
                message: "You are not authorized",
            })
        }

        await Blog.findByIdAndUpdate(comment.blog._id, { $pull: { comments: id } })
        await Comment.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error adding comment", error: error.message });
    }
}

async function editComment(req, res) {
    try {
        const userID = req.user;
        const { id } = req.params;
        const { updateComment } = req.body;

        const comment = await Comment.findById(id);

        if(!comment){
            return res.status(500).json({
                message: "Comment is not found",
            })            
        }

        if(comment.user != userID){
            return res.status(500).json({
                success : false,
                message: "You are not authorized",
            })
        }

        await Comment.findByIdAndUpdate(id,{
            comment : updateComment
        })

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error adding comment", error: error.message });
    }
}

async function likeComment(req, res) {

    try {
        const userId = req.user;
        const { id } = req.params;

        const comment = await Comment.findById(id);


        if (!comment) {
            return res.status(500).json({
                message: "Comment not found"
            })
        }

        if (!comment.likes.includes(userId)) {
            await Comment.findByIdAndUpdate(id, { $push: { likes: userId } })
            return res.status(200).json({
                success: true,
                message: "Comment Liked Successfully",
            });
        } else {
            await Comment.findByIdAndUpdate(id, { $pull: { likes: userId } })
            return res.status(200).json({
                success: true,
                message: "Comment DisLiked Successfully",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = { addComment, deleteComment, editComment, likeComment };