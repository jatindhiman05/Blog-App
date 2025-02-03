const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");
const User = require("../models/userSchema");
const path = require('path');
const mongoose = require("mongoose");
const ShortUniqueId = require('short-unique-id')
const { randomUUID } = new ShortUniqueId({ length: 10 });

const { uploadImage, deleteImagefromCloudinary } = require("../utils/uploadImage");
const fs = require('fs');

// Get all public blogs
async function getAllBlogs(req, res) {
    try {
        const publicBlogs = await Blog.find({ draft: false }).populate({
            path: "creator",
            select: "-password",
        }).populate({
            path: "likes",
            select: "name email"
        }).populate({
            path: "comments",
            select: "comment user"
        });
        return res.status(200).json({ success: true, blogs: publicBlogs });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching blogs", error: error.message });
    }
}

// Get a blog by ID
async function getBlogByID(req, res) {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findOne({blogId}).populate({
            path: "creator",
            select: "-password",
        }).populate({
            path: "likes",
            select: "name email"
        }).populate({
            path: "comments",
            select: "comment user"
        });

        console.log(blog)

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        return res.status(200).json({ success: true, blog });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching blog", error: error.message });
    }
}

async function addBlog(req, res) {
    try {
        const creator = req.user;
        const { title, description, draft } = req.body;
        const image = req.file;

        console.log({ title, description, draft, image });

        if (!description) {
            return res.status(400).json({ success: false, message: "Description is required" });
        }

        const user = await User.findById(creator);
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // cloudinary

        const { secure_url, public_id } = await uploadImage(image.path)
        fs.unlinkSync(image.path)

        const blogId = title.toLowerCase().split(" ").join('-') + "-" + randomUUID();

        const newBlog = await Blog.create({
            title, description, draft, creator, image: secure_url, imageId: public_id, blogId
        });

        user.blogs.push(newBlog._id);
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog: newBlog,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error creating blog", error: error.message });
    }
}


// Update a blog
async function updateBlog(req, res) {
    try {
        const creator = req.user;
        const image = req.file;
        const { id } = req.params;
        const { title, description,draft } = req.body;


        const blog = await Blog.findOne({ blogId: id });

        if (!blog) {
            return res.status(500).json({
                message: "Blog is not found",
            });
        }

        if (creator != blog.creator) {
            return res.status(500).json({
                message: "You are not authorized for this action",
            });
        }

        if (image) {
            await deleteImagefromCloudinary(blog.imageId)
            const { secure_url, public_id } = await uploadImage(image.path)
            blog.image = secure_url
            blog.imageId = public_id
            fs.unlinkSync(image.path)
        }

        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.draft = draft || blog.draft;


        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
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

        await deleteImagefromCloudinary(blog.imageId)

        await Blog.findByIdAndDelete(id);
        await User.findByIdAndUpdate(creator, { $pull: { blogs: id } })
        return res.status(200).json({
            success: true,
            message: "Blog Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function likeBlog(req, res) {

    try {
        const creator = req.user;
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(500).json({
                message: "Blog is not found"
            })
        }

        if (!blog.likes.includes(creator)) {
            await Blog.findByIdAndUpdate(id, { $push: { likes: creator } })
            return res.status(200).json({
                success: true,
                message: "Blog Liked Successfully",
            });
        } else {
            await Blog.findByIdAndUpdate(id, { $pull: { likes: creator } })
            return res.status(200).json({
                success: true,
                message: "Blog DisLiked Successfully",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


module.exports = { getAllBlogs, getBlogByID, addBlog, updateBlog, deleteBlog, likeBlog };
