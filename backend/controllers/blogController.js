const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");


async function getAllBlogs(req, res) {
    try {
        const publicBlogs = await Blog.find({ draft: false }).populate({
            path : "creator",
            select : "-password"
        });
        return res.status(200).json({ success: true, publicBlogs });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching blogs", error: error.message });
    }
}

async function getBlogByID(req, res) {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
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
        const {title, description , draft, creator} = req.body;
        if(!description){
            return res.status(400).json({ success: false, message: "Description Required!"});
        }
        const finduser = await User.findById(creator);

        if(!finduser){
            return res.status(500).json({ success: false, message: "User Does not Exist " });
        }
        const newBlog = await Blog.create(req.body);

        await User.findByIdAndUpdate(creator,{ $push : {blogs: newBlog._id}})
        return res.status(201).json({ success: true, message: "Blog created successfully", newBlog });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error creating blog", error: error.message });
    }
}

async function updateBlog(req, res) {
    const { id } = req.params;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        return res.status(200).json({ success: true, message: "Blog updated successfully", updatedBlog });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error updating blog", error: error.message });
    }
}

async function deleteBlog(req, res) {
    const { id } = req.params;
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        return res.status(200).json({ success: true, message: "Blog deleted successfully", deletedBlog });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting blog", error: error.message });
    }
}

module.exports = { getAllBlogs, getBlogByID, addBlog, updateBlog, deleteBlog };
