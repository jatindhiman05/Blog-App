import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import { useSelector } from 'react-redux';
import {
    FaRegHeart,
    FaHeart,
    FaRegCommentDots,
    FaRegBookmark,
    FaBookmark,
} from 'react-icons/fa';

function DisplayBlogs({ blogs }) {
    const { token, id: userId } = useSelector((state) => state.user);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <Link
                        key={blog._id}
                        to={`/blog/${blog.blogId}`}
                        className="block group mb-12"
                    >
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Image */}
                            {blog.image && (
                                <div className="sm:w-1/3 overflow-hidden rounded-xl shadow-sm">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Blog Info */}
                            <div className="sm:w-2/3">
                                {/* Creator */}
                                <div className="flex items-center gap-2 mb-2">
                                    <Link to={`/@${blog.creator?.username || 'unknown'}`}>
                                        <img
                                            src={
                                                blog?.creator?.profilePic
                                                    ? blog.creator.profilePic
                                                    : `https://api.dicebear.com/7.x/initials/svg?seed=${blog.creator.name}`
                                            }
                                            alt={blog?.creator?.name || 'Unknown Creator'}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    </Link>
                                    <span className="text-sm text-gray-700">
                                        {blog?.creator?.name || 'Unknown'}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-black">
                                    {blog.title}
                                </h2>
                                <p className="text-gray-700 line-clamp-3 mt-2">{blog.description}</p>

                                {/* Meta Info */}
                                <div className="flex items-center text-sm text-gray-500 mt-4 flex-wrap gap-4">
                                    <span>{formatDate(blog.createdAt)}</span>

                                    <span className="flex items-center gap-1">
                                        {blog.likes.includes(userId) ? (
                                            <FaHeart className="text-red-500" />
                                        ) : (
                                            <FaRegHeart />
                                        )}
                                        {blog.likes.length}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <FaRegCommentDots />
                                        {blog.comments.length}
                                    </span>

                                    <span
                                        className="flex items-center gap-1 cursor-pointer"
                                        onClick={(e) => handleSaveBlog(e, blog._id)}
                                    >
                                        {blog.totalSaves.includes(userId) ? (
                                            <FaBookmark className="text-blue-500" />
                                        ) : (
                                            <FaRegBookmark />
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-8 border-gray-200" />
                    </Link>
                ))
            ) : (
                <h1 className="text-2xl font-semibold text-center text-gray-700">
                    No blogs found
                </h1>
            )}
        </div>
    );
}

export default DisplayBlogs;
