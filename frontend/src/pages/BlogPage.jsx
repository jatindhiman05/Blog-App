import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Bookmark, MoreHorizontal, MessageCircle, ThumbsUp, Edit } from "lucide-react";
import { toast } from "react-toastify";

const BlogPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    async function fetchBlogById() {
        try {
            let res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
            setBlogData(res.data.blog);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load blog");
        }
    }

    useEffect(() => {
        fetchBlogById();
    }, [id]);

    if (!blogData) {
        return <div className="text-center text-gray-600 text-lg py-20">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 bg-white">
            {/* Title & Author Section */}
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">{blogData.title}</h1>

            <div className="flex items-center justify-between mt-6 space-x-4 border-b pb-6">
                <div className="flex items-center space-x-4">
                    <img
                        src={blogData.image}
                        alt={blogData.creator.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-gray-900 font-semibold text-lg">{blogData.creator.name}</p>
                        <p className="text-sm text-gray-500">
                            {new Date(blogData.createdAt).toDateString()} • 7 min read
                        </p>
                    </div>
                </div>

                {user.email === blogData.creator.email && <Link to={`/edit/${id}`} className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <Edit className="w-5 h-5" />
                    <span>Edit</span>
                </Link>}
                
            </div>

            {/* Blog Image */}
            {blogData.image && (
                <div className="w-full mt-6 rounded-lg overflow-hidden shadow-sm">
                    <img src={blogData.image} alt="Blog Cover" className="w-full object-cover rounded-lg" />
                </div>
            )}

            {/* Blog Content */}
            <article className="mt-8 text-lg leading-relaxed text-gray-800 tracking-wide break-words">
                {blogData.description}
            </article>

            {/* Engagement Section */}
            <div className="flex items-center justify-between mt-6 border-t pt-4 text-gray-600 text-sm">
                <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                        <ThumbsUp className="w-5 h-5 mr-1 text-gray-500 hover:text-gray-900 cursor-pointer" />
                        <span>{blogData.likes.length}</span>
                    </span>
                    <span className="flex items-center">
                        <MessageCircle className="w-5 h-5 mr-1 text-gray-500 hover:text-gray-900 cursor-pointer" />
                        <span>{blogData.comments.length}</span>
                    </span>
                </div>
                <div className="flex space-x-4">
                    <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-900 cursor-pointer" />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-gray-500 text-sm text-center">
                <p>© {new Date().getFullYear()} by {blogData.creator.name}. All rights reserved.</p>
            </div>
        </div>
    );
};

export default BlogPage;
