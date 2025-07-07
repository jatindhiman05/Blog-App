const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");
const User = require("../models/userSchema");
const ShortUniqueId = require("short-unique-id"); 
const sendNotification = require("../utils/sendNotification");
const { randomUUID } = new ShortUniqueId({ length: 10 });
const {
    uploadImage,
    deleteImagefromCloudinary,
} = require("../utils/uploadImage");

// safe controllers
async function createBlog(req, res) {
    try {
        const creator = req.user;
        const { title, description } = req.body;
        const draft = req.body.draft === "false" ? false : true;
        const { image, images } = req.files;

        const content = JSON.parse(req.body.content);
        const tags = JSON.parse(req.body.tags);

        if (!title || !description || !content) {
            return res.status(400).json({
                message: "Title, description, and content are required.",
            });
        }

        // Upload embedded images from content
        let imageIndex = 0;
        for (let i = 0; i < content.blocks.length; i++) {
            const block = content.blocks[i];
            if (block.type === "image") {
                const { secure_url, public_id } = await uploadImage(
                    `data:image/jpeg;base64,${images[imageIndex].buffer.toString("base64")}`
                );

                block.data.file = {
                    url: secure_url,
                    imageId: public_id,
                };
                imageIndex++;
            }
        }

        // Upload main blog image
        const { secure_url, public_id } = await uploadImage(
            `data:image/jpeg;base64,${image[0].buffer.toString("base64")}`
        );

        const blogId = title.toLowerCase().split(" ").join("-") + "-" + randomUUID();

        const blog = await Blog.create({
            title,
            description,
            content,
            draft,
            creator,
            image: secure_url,
            imageId: public_id,
            blogId,
            tags,
        });

        await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });

        if (!draft) {
            const user = await User.findById(creator).select("followers name");
            const followers = user.followers || [];

            for (const followerId of followers) {
                await sendNotification({
                    req,
                    recipientId: followerId,
                    senderId: creator,
                    type: "custom",
                    blogId: blog._id,
                    message: `${user.name} posted a new blog`,
                });
            }
        }

        return res.status(200).json({
            message: draft
                ? "Blog saved as draft. You can publish it from your profile."
                : "Blog created successfully.",
            blog,
        });
    } catch (error) {
        console.error("Blog creation error:", error);
        return res.status(500).json({
            message: "Failed to create blog",
            error: error.message,
        });
    }
}

module.exports = createBlog;

async function getBlogs(req, res) {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({ draft: false })
            .populate({
                path: "creator",
                select: "-password",
            })
            .populate({
                path: "likes",
                select: "email name",
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments({ draft: false });

        return res.status(200).json({
            message: "Blogs fetched Successfully",
            blogs,
            hasMore: skip + limit < totalBlogs,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function getBlog(req, res) {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findOne({ blogId })
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name email username profilePic",
                },
            })
            .populate({
                path: "creator",
                select: "name email followers username profilePic",
            })
            .lean();

        async function populateReplies(comments) {
            for (const comment of comments) {
                let populatedComment = await Comment.findById(comment._id)
                    .populate({
                        path: "replies",
                        populate: {
                            path: "user",
                            select: "name email username profilePic",
                        },
                    })
                    .lean();

                comment.replies = populatedComment.replies;

                if (comment.replies && comment.replies.length > 0) {
                    await populateReplies(comment.replies);
                }
            }
            return comments;
        }

        blog.comments = await populateReplies(blog.comments);

        if (!blog) {
            return res.status(404).json({
                message: "Blog Not found",
            });
        }
        return res.status(200).json({
            message: "Blog fetched Successfully",
            blog,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function updateBlog(req, res) {
    try {
        const creator = req.user;
        const { id } = req.params;
        const { title, description } = req.body;
        const draft = req.body.draft == "false" ? false : true;

        const content = JSON.parse(req.body.content);
        const tags = JSON.parse(req.body.tags);
        const existingImages = JSON.parse(req.body.existingImages);

        const blog = await Blog.findOne({ blogId: id });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        if (creator.toString() !== blog.creator.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this blog",
            });
        }

        // Identify images to delete
        let imagesToDelete = blog.content.blocks
            .filter((block) => block.type == "image")
            .filter(
                (block) => !existingImages.find(({ url }) => url == block.data.file.url)
            )
            .map((block) => block.data.file.imageId);

        // Upload new embedded images
        if (req.files.images) {
            let imageIndex = 0;

            for (let i = 0; i < content.blocks.length; i++) {
                const block = content.blocks[i];
                if (block.type === "image" && block.data.file.image) {
                    const { secure_url, public_id } = await uploadImage(
                        `data:image/jpeg;base64,${req.files.images[
                            imageIndex
                        ].buffer.toString("base64")}`
                    );

                    block.data.file = {
                        url: secure_url,
                        imageId: public_id,
                    };

                    imageIndex++;
                }
            }
        }

        // Replace cover image if new one provided
        if (req?.files?.image) {
            await deleteImagefromCloudinary(blog.imageId);
            const { secure_url, public_id } = await uploadImage(
                `data:image/jpeg;base64,${req.files.image[0].buffer.toString("base64")}`
            );
            blog.image = secure_url;
            blog.imageId = public_id;
        }

        // Update blog fields
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.draft = draft;
        blog.content = content || blog.content;
        blog.tags = tags || blog.tags;

        await blog.save();

        if (draft) {
            return res.status(200).json({
                message: "Blog saved as draft. You can publish it later.",
                blog,
            });
        }

        // Notify followers if blog is updated and published
        const user = await User.findById(creator).select("followers name");
        const followers = user.followers || [];

        for (const followerId of followers) {
            await sendNotification({
                req,
                recipientId: followerId,
                senderId: creator,
                type: "custom",
                blogId: blog._id,
                message: `${user.name} updated their blog: ${blog.title}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog,
        });
    } catch (error) {
        console.log("Update Blog Error:", error);
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
                message: "Blog is not found",
            });
        }

        if (creator != blog.creator) {
            return res.status(500).json({
                message: "You are not authorized for this action",
            });
        }

        await deleteImagefromCloudinary(blog.imageId);

        await Blog.findByIdAndDelete(id);
        await User.findByIdAndUpdate(creator, { $pull: { blogs: id } });

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function likeBlog(req, res) {
    try {
        const userId = req.user;
        const { id: blogId } = req.params;

        const blog = await Blog.findById(blogId).populate("creator", "_id name");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        const alreadyLiked = blog.likes.includes(userId);

        if (!alreadyLiked) {
            // Like the blog
            await Blog.findByIdAndUpdate(blogId, { $push: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $push: { likeBlogs: blogId } });

            // Send notification (if not liking own blog)
            if (userId.toString() !== blog.creator._id.toString()) {
                await sendNotification({
                    req,
                    recipientId: blog.creator._id,
                    senderId: userId,
                    type: "like",
                    blogId: blog._id,
                    message: `liked your blog "${blog.title}"`,
                });
            }

            return res.status(200).json({
                success: true,
                message: "Blog liked successfully",
                isLiked: true,
            });
        } else {
            // Unlike the blog
            await Blog.findByIdAndUpdate(blogId, { $pull: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { likeBlogs: blogId } });

            return res.status(200).json({
                success: true,
                message: "Blog unliked successfully",
                isLiked: false,
            });
        }
    } catch (error) {
        console.error("Error liking blog:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
}


async function saveBlog(req, res) {
    try {
        const user = req.user;
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(500).json({
                message: "Blog is not found",
            });
        }

        if (!blog.totalSaves.includes(user)) {
            await Blog.findByIdAndUpdate(id, { $set: { totalSaves: user } });
            await User.findByIdAndUpdate(user, { $set: { saveBlogs: id } });
            return res.status(200).json({
                success: true,
                message: "Blog has been saved",
                isLiked: true,
            });
        } else {
            await Blog.findByIdAndUpdate(id, { $unset: { totalSaves: user } });
            await User.findByIdAndUpdate(user, { $unset: { saveBlogs: id } });
            return res.status(200).json({
                success: true,
                message: "Blog Unsaved",
                isLiked: false,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function searchBlogs(req, res) {
    try {
        const { search, tag } = req.query;

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        let query;

        if (tag) {
            query = { tags: tag };
        } else {
            query = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ],
            };
        }

        const blogs = await Blog.find(query, { draft: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "creator",
                select: "name email followers username profilePic",
            });
        if (blogs.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Make sure all words are spelled correctly.Try different keywords . Try more general keywords",
                hasMore: false,
            });
        }

        const totalBlogs = await Blog.countDocuments(query, { draft: false });

        return res.status(200).json({
            success: true,
            blogs,
            hasMore: skip + limit < totalBlogs,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

module.exports = {
    createBlog,
    deleteBlog,
    getBlog,
    getBlogs,
    updateBlog,
    likeBlog,
    saveBlog,
    searchBlogs,
};
