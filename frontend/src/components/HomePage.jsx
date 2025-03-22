import React, { useState } from "react";
import { useSelector } from "react-redux";
import DisplayBlogs from "./DisplayBlogs";
import usePagination from "../hooks/usePagination";
import { Link } from "react-router-dom";
import { Loader2, ChevronDown } from "lucide-react";

function HomePage() {
    const [page, setPage] = useState(1);
    const { token, id: userId } = useSelector((state) => state.user);

    const { blogs, hasMore, isLoading } = usePagination("blogs", {}, 4, page);

    const topics = ["React", "Node.js", "MERN", "Express", "JavaScript", "Algorithms"];

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
                {/* Main Blog Section */}
                <div className="w-full md:w-[75%] pl-10 pr-10">
                    {!isLoading && blogs.length > 0 ? (
                        <>
                            <DisplayBlogs blogs={blogs} />

                            {/* Load More */}
                            {hasMore && (
                                <div className="flex justify-center mt-12">
                                    <button
                                        onClick={() => setPage((prev) => prev + 1)}
                                        className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 shadow-sm"
                                    >
                                        Load More
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin w-16 h-16 text-blue-600" />
                        </div>
                    ) : (
                        <div className="flex justify-center items-center py-20">
                            <p className="text-center text-gray-500 text-lg">No blogs found.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-[35%]">
                    <div className="sticky top-20 space-y-8">
                        {/* Topics Section */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-xl font-semibold text-gray-800 mb-5">
                                Recommended Topics
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {topics.map((tag, index) => (
                                    <Link
                                        key={index}
                                        to={`/tag/${tag}`}
                                        className="bg-gray-100 hover:bg-blue-600 hover:text-white transition-all px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-200 hover:border-blue-600"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* About Widget */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-xl font-semibold text-gray-800 mb-5">About Us</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Welcome to our blogging platform where we share insights,
                                tutorials, and stories about web development and technology.
                            </p>
                            <div className="mt-4">
                                <Link
                                    to="/about"
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                >
                                    Learn more →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
