import React, { useEffect, useState } from "react";
import { Sparkle, ThumbsUp, MessageCircle } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            let res = await axios.get("http://localhost:3000/api/v1/blogs");
            setBlogs(res.data.blogs);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }).format(new Date(dateString));
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "…";
        }
        return text;
    };

    return (
        <div className="flex justify-center py-10 min-h-screen">
            <div className="w-full max-w-2xl space-y-6">
                {blogs.map((blog) => (
                    <Link to={`/blog/${blog.blogId}`} key={blog.blogId} className="block">
                        <div className="flex flex-col sm:flex-row items-start p-5 bg-white rounded-lg hover:shadow-sm transition">
                            {/* Blog Content */}
                            <div className="flex-1">
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <img
                                        src={blog.image}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full mr-2 border border-gray-300"
                                    />
                                    <span className="font-medium">{blog?.creator?.name}</span>
                                    <span className="mx-2">·</span>
                                    <span>{formatDate(blog?.createdAt)}</span>
                                </div>

                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-500 transition">
                                    {blog.title}
                                </h2>

                                <p className="text-gray-700 mt-2 text-sm break-words overflow-hidden">
                                    {truncateText(blog.description, 200)}
                                </p>

                                <div className="flex items-center text-sm text-gray-500 mt-3 space-x-4">
                                    <span className="flex items-center">
                                        <ThumbsUp className="w-4 h-4 mr-1 text-gray-500 hover:text-gray-900 cursor-pointer" />
                                        <span>{blog?.likes?.length}</span>
                                    </span>
                                    <span className="flex items-center">
                                        <MessageCircle className="w-4 h-4 mr-1 text-gray-500 hover:text-gray-900 cursor-pointer" />
                                        <span>{blog.comments.length}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Blog Thumbnail */}
                            {blog.image && (
                                <div className="w-32 h-24 ml-4 flex-shrink-0 rounded-lg overflow-hidden shadow hidden sm:block">
                                    <img
                                        src={blog.image}
                                        alt="Blog Thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
