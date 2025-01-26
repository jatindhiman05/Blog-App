const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

// Get all public blogs
async function getAllBlogs(req, res) {
    try {
        const publicBlogs = await Blog.find({ draft: false }).populate({
            path: "creator",
            select: "-password",
        });
        return res.status(200).json({ success: true, blogs: publicBlogs });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching blogs", error: error.message });
    }
}

// Get a blog by ID
async function getBlogByID(req, res) {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid blog ID" });
        }

        const blog = await Blog.findById(id).populate({
            path: "creator",
            select: "-password",
        });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        return res.status(200).json({ success: true, blog });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching blog", error: error.message });
    }
}

// Add a new blog
async function addBlog(req, res) {
    try {
        const creator = req.user;
        const { title, description, draft } = req.body;

        if (!description) {
            return res.status(400).json({ success: false, message: "Description is required" });
        }

        const user = await User.findById(creator);
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const newBlog = await Blog.create({ title, description, draft, creator });
        user.blogs.push(newBlog._id);
        await user.save();

        return res.status(201).json({ success: true, message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error creating blog", error: error.message });
    }
}

// Update a blog
async function updateBlog(req, res) {
    try {
        const creator = req.user;
        const { id } = req.params;
        const { title, description, draft } = req.body;

        const blog = await Blog.findOneAndUpdate(
            { _id: id, creator },
            { title, description, draft },
            { new: true }
        );

        if (!blog) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized for this action or blog not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog Updated Successfully",
            blog,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function deleteBlog(req, res) {

    try {
        const creator = req.user;
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(500).json({
                message: "Blog is not found"
            })
        }

        if (creator != blog.creator) {
            return res.status(500).json({
                message: "You are not authorized for this action",
            })
        }

        await Blog.findByIdAndDelete(id);
        await User.findByIdAndUpdate(creator, { $pull: { blogs: id } })
        return res.status(200).json({
            success: true,
            message: "Blog Updated Successfully",
            blog,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = { getAllBlogs, getBlogByID, addBlog, updateBlog, deleteBlog };
