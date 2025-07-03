import React, { useState } from "react";
import { useSelector } from "react-redux";
import usePagination from "../hooks/usePagination";
import { Link } from "react-router-dom";
import { Loader2, ChevronDown, ArrowRight, Settings, HelpCircle, Hash } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import {
    FaRegHeart,
    FaHeart,
    FaRegCommentDots,
    FaRegBookmark,
    FaBookmark,
} from "react-icons/fa";

function HomePage() {
    const [page, setPage] = useState(1);
    const { token, id: userId } = useSelector((state) => state.user);
    const { blogs, hasMore, isLoading } = usePagination("blogs", {}, 4, page);

    const topics = [
        "React",
        "Node.js",
        "MERN",
        "Express",
        "JavaScript",
        "Algorithms",
        "Frontend",
        "Backend",
        "Fullstack",
        "Database"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-darkbg dark:to-darkbg py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with Start Writing button */}
                <div className="mb-12 text-center px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-darktext mb-3">
                        Discover & Share{" "}
                        <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-accent dark:to-indigo-400 bg-clip-text text-transparent">
                            Knowledge
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-darktext/80 max-w-2xl mx-auto mb-4">
                        Explore insightful articles, tutorials, and stories from the developer community.
                    </p>
                    <Link
                        to={token ? "/add-blog" : "/signin"}
                        className="inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-accent dark:hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                    >
                        Start Writing
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content Area */}
                    <div className="w-full lg:w-2/3">
                        {!isLoading && blogs.length > 0 ? (
                            <div className="space-y-5">
                                {blogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        className="bg-white dark:bg-darkcard rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow duration-200  border-gray-100 dark:border-darkborder"
                                    >
                                        <Link to={`/blog/${blog.blogId}`} className="block group">
                                            <div className="flex flex-col sm:flex-row h-full">
                                                {/* Image */}
                                                {blog.image && (
                                                    <div className="sm:w-2/5 overflow-hidden">
                                                        <img
                                                            src={blog.image}
                                                            alt={blog.title}
                                                            className="w-full h-44 sm:h-60 object-fill transition-transform duration-200 group-hover:scale-[1.02]"
                                                        />
                                                    </div>
                                                )}

                                                {/* Blog Content */}
                                                <div className={`p-4 sm:p-4 ${blog.image ? 'sm:w-3/5' : 'w-full'}`}>
                                                    {/* Creator */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Link
                                                            to={`/@${blog.creator?.username || 'unknown'}`}
                                                            className="hover:opacity-80 transition-opacity"
                                                        >
                                                            <img
                                                                src={
                                                                    blog?.creator?.profilePic
                                                                        ? blog.creator.profilePic
                                                                        : `https://api.dicebear.com/7.x/initials/svg?seed=${blog.creator.name}`
                                                                }
                                                                alt={blog?.creator?.name || 'Unknown Creator'}
                                                                className="w-8 h-8 rounded-full object-cover  border-white dark:border-darkcard shadow-xs"
                                                            />
                                                        </Link>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-darktext line-clamp-1">
                                                                {blog?.creator?.name || 'Unknown'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-darktext/70">
                                                                {formatDate(blog.createdAt)} · {Math.ceil(blog.description.length / 5)} min read
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Title & Description */}
                                                    <h2 className="text-lg font-bold text-gray-900 dark:text-darktext mb-2 group-hover:text-indigo-600 dark:group-hover:text-accent transition-colors line-clamp-2">
                                                        {blog.title}
                                                    </h2>
                                                    <p className="text-sm text-gray-600 dark:text-darktext/80 line-clamp-2 mb-3">
                                                        {blog.description}
                                                    </p>

                                                    {/* Tags */}
                                                    {blog.tags?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                                            {blog.tags.slice(0, 2).map((tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-2 py-1 bg-indigo-50 dark:bg-darkbg text-indigo-700 dark:text-accent text-xs rounded-md"
                                                                >
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Meta Info */}
                                                    <div className="flex items-center gap-3 mt-2 pt-2  border-gray-100 dark:border-darkborder text-xs sm:text-sm">
                                                        <span className="flex items-center gap-1 text-gray-500 dark:text-darktext/70 hover:text-gray-700 dark:hover:text-darktext transition-colors">
                                                            {blog.likes.includes(userId) ? (
                                                                <FaHeart className="text-red-500 dark:text-accent text-sm" />
                                                            ) : (
                                                                <FaRegHeart className="text-sm" />
                                                            )}
                                                            {blog.likes.length}
                                                        </span>

                                                        <span className="flex items-center gap-1 text-gray-500 dark:text-darktext/70 hover:text-gray-700 dark:hover:text-darktext transition-colors">
                                                            <FaRegCommentDots className="text-sm" />
                                                            {blog.comments.length}
                                                        </span>

                                                        <span className="flex items-center gap-1 text-gray-500 dark:text-darktext/70 hover:text-gray-700 dark:hover:text-darktext transition-colors">
                                                            {blog.totalSaves.includes(userId) ? (
                                                                <FaBookmark className="text-indigo-500 dark:text-accent text-sm" />
                                                            ) : (
                                                                <FaRegBookmark className="text-sm" />
                                                            )}
                                                            {blog.totalSaves.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => setPage((prev) => prev + 1)}
                                            className="flex items-center gap-2 rounded-lg  border-gray-200 dark:border-darkborder bg-white dark:bg-darkcard px-5 py-2 text-sm font-medium text-gray-700 dark:text-darktext hover:border-indigo-500 dark:hover:border-accent hover:bg-indigo-50 dark:hover:bg-darkbg hover:text-indigo-600 dark:hover:text-accent transition-all duration-200"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin w-4 h-4 text-indigo-600 dark:text-accent" />
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    Load More
                                                    <ChevronDown className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : isLoading ? (
                            <div className="flex justify-center items-center py-16">
                                <Loader2 className="animate-spin w-10 h-10 text-indigo-600 dark:text-accent" />
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-darkcard rounded-md  border-gray-200 dark:border-darkborder p-6 text-center">
                                <div className="max-w-md mx-auto">
                                    <p className="text-gray-600 dark:text-darktext/80 mb-4">
                                        No Blogs Found. Start Writing 😃
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-5">
                        {/* Topics Section */}
                        <div className="bg-white dark:bg-darkcard rounded-lg  border-gray-200 dark:border-darkborder p-4 shadow-sm hover:shadow transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-darktext flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-indigo-600 dark:text-accent" />
                                    Popular Topics
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {topics.map((tag, index) => (
                                    <Link
                                        key={index}
                                        to={`/tag/${tag}`}
                                        className="bg-gray-50 dark:bg-darkbg hover:bg-indigo-50 dark:hover:bg-darkborder text-gray-700 dark:text-darktext hover:text-indigo-600 dark:hover:text-accent px-2.5 py-1 rounded text-xs font-medium border border-gray-200 dark:border-darkborder hover:border-indigo-300 dark:hover:border-accent transition-all"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* About Widget */}
                        <div className="bg-white dark:bg-darkcard rounded-lg  border-gray-200 dark:border-darkborder p-4 shadow-sm hover:shadow transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-darktext mb-2 flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-accent" />
                                About Us
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-darktext/80 mb-3">
                                Welcome to our blogging platform where we share insights,
                                tutorials, and stories about web development and technology.
                            </p>
                            <div className="space-y-2">
                                <Link
                                    to="/about"
                                    className="inline-flex items-center text-indigo-600 dark:text-accent hover:text-indigo-700 dark:hover:text-accent/80 text-xs font-medium group"
                                >
                                    Learn more about us
                                    <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4  border-gray-100 dark:border-darkborder text-center mt-24 ">
                <p className="text-xs text-gray-500 dark:text-darktext/70">
                    © {new Date().getFullYear()} Blogosphere. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default HomePage;