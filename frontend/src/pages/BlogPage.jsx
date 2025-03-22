import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    addSlectedBlog,
    changeLikes,
    removeSelectedBlog,
} from "../utils/selectedBlogSlice";
import Comment from "../components/Comment";
import { setIsOpen } from "../utils/commentSlice";
import { formatDate } from "../utils/formatDate";
import { updateData } from "../utils/userSilce";

// Icons
import {
    FaRegThumbsUp,
    FaThumbsUp,
    FaRegCommentDots,
    FaBookmark,
    FaRegBookmark,
    FaEdit,
} from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

// Helper Functions
export async function handleSaveBlogs(id, token) {
    try {
        let res = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/save-blog/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success(res.data.message);
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
    }
}

export async function handleFollowCreator(id, token, dispatch) {
    try {
        let res = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/follow/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success(res.data.message);
        dispatch(updateData(["followers", id]));
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
    }
}

function BlogPage() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { token, email, id: userId, profilePic, following } = useSelector(
        (state) => state.user
    );
    const { likes, comments, content } = useSelector(
        (state) => state.selectedBlog
    );
    const { isOpen } = useSelector((state) => state.comment);

    const [blogData, setBlogData] = useState(null);
    const [isBlogSaved, setIsBlogSaved] = useState(false);
    const [isLike, setIsLike] = useState(false);

    async function fetchBlogById() {
        try {
            let {
                data: { blog },
            } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`
            );
            setBlogData(blog);
            setIsBlogSaved(blog?.totalSaves?.includes(userId));
            dispatch(addSlectedBlog(blog));

            if (blog.likes.includes(userId)) {
                setIsLike(true);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleLike() {
        if (!token) {
            return toast.error("Please sign in to like this blog");
        }

        setIsLike((prev) => !prev);

        try {
            let res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            dispatch(changeLikes(userId));
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        fetchBlogById();

        return () => {
            dispatch(setIsOpen(false));
            if (
                window.location.pathname !== `/edit/${id}` &&
                window.location.pathname !== `/blog/${id}`
            ) {
                dispatch(removeSelectedBlog());
            }
        };
    }, [id]);

    return (
        <div className="max-w-3xl mx-auto p-5 text-gray-800">
            {blogData ? (
                <div>
                    <h1 className="mt-10 font-bold text-4xl sm:text-5xl lg:text-6xl capitalize leading-tight text-gray-900">
                        {blogData.title}
                    </h1>

                    {/* Creator Info + Edit Button */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-6 gap-4">
                        {/* Creator Info */}
                        <div className="flex items-center gap-4">
                            <Link to={`/@${blogData?.creator?.username || ""}`}>
                                <img
                                    src={
                                        blogData?.creator?.profilePic
                                            ? blogData?.creator?.profilePic
                                            : `https://api.dicebear.com/9.x/initials/svg?seed=${blogData?.creator?.name || "User"}`
                                    }
                                    alt="Creator"
                                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                />
                            </Link>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <Link to={`/@${blogData?.creator?.username || ""}`}>
                                        <h2 className="text-lg font-semibold hover:underline text-blue-700">
                                            {blogData?.creator?.name || "Unknown"}
                                        </h2>
                                    </Link>

                                    {userId !== blogData?.creator?._id && (
                                        <button
                                            onClick={() =>
                                                handleFollowCreator(
                                                    blogData?.creator?._id,
                                                    token,
                                                    dispatch
                                                )
                                            }
                                            className="ml-2 px-3 py-1 text-sm rounded-full bg-green-100 hover:bg-green-200 text-green-700"
                                        >
                                            {following?.includes(blogData?.creator?._id)
                                                ? "Following"
                                                : "Follow"}
                                        </button>
                                    )}
                                </div>

                                <div className="text-gray-500 text-sm">
                                    <span>6 min read</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatDate(blogData?.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {token && email === blogData?.creator?.email && (
                            <Link to={`/edit/${blogData?.blogId}`}>
                                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition-all">
                                    <FaEdit />
                                    Edit
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Blog Image */}
                    {blogData?.image && (
                        <img
                            src={blogData?.image}
                            alt="Blog"
                            className="w-full rounded-lg shadow-md mb-8"
                        />
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-8 text-gray-700 text-lg">
                        <div className="flex gap-8">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                                {isLike ? (
                                    <FaThumbsUp className="text-blue-600" />
                                ) : (
                                    <FaRegThumbsUp />
                                )}
                                <span>{likes?.length || 0}</span>
                            </button>

                            {/* Comment */}
                            <button
                                onClick={() => dispatch(setIsOpen())}
                                className="flex items-center gap-2 hover:text-green-600 transition-colors"
                            >
                                <FaRegCommentDots />
                                <span>{comments?.length || 0}</span>
                            </button>
                        </div>

                        {/* Save */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSaveBlogs(blogData?._id, token);
                                setIsBlogSaved((prev) => !prev);
                            }}
                            className="flex items-center gap-2 hover:text-purple-600 transition-colors"
                        >
                            {isBlogSaved ? (
                                <FaBookmark className="text-purple-600" />
                            ) : (
                                <FaRegBookmark />
                            )}
                        </button>
                    </div>

                    {/* Blog Content */}
                    <div className="prose prose-lg my-10 max-w-none text-gray-800">
                        {content?.blocks?.map((block, index) => {
                            if (block.type === "header") {
                                const HeaderTag = `h${block.data.level}`;
                                return (
                                    <HeaderTag
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                            __html: block.data.text,
                                        }}
                                    />
                                );
                            }

                            if (block.type === "paragraph") {
                                return (
                                    <p
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                            __html: block.data.text,
                                        }}
                                    />
                                );
                            }

                            if (block.type === "image") {
                                return (
                                    <figure key={index} className="my-4">
                                        <img
                                            src={block.data.file.url}
                                            alt="Block"
                                            className="rounded-md shadow-sm"
                                        />
                                        {block.data.caption && (
                                            <figcaption className="text-center text-gray-500 text-sm mt-2">
                                                {block.data.caption}
                                            </figcaption>
                                        )}
                                    </figure>
                                );
                            }

                            if (block.type === "list") {
                                const ListTag = block.data.style === "ordered" ? "ol" : "ul";
                                return (
                                    <ListTag
                                        key={index}
                                        className={
                                            block.data.style === "ordered"
                                                ? "list-decimal pl-6 my-4"
                                                : "list-disc pl-6 my-4"
                                        }
                                    >
                                        {block.data.items.map((item, idx) => (
                                            <li
                                                key={idx}
                                                dangerouslySetInnerHTML={{
                                                    __html: item,
                                                }}
                                            />
                                        ))}
                                    </ListTag>
                                );
                            }

                            return null;
                        })}
                    </div>

                    {/* Comment Section */}
                    {isOpen && <Comment blogId={blogData?._id} />}
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <FiLoader className="animate-spin text-4xl text-gray-400" />
                </div>
            )}
        </div>
    );
}

export default BlogPage;
