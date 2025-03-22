import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { updateData } from "../utils/userSilce";

function Setting() {
    const {
        token,
        id: userId,
        showLikedBlogs,
        showSavedBlogs,
    } = useSelector((state) => state.user);

    const [data, setData] = useState({
        showLikedBlogs,
        showSavedBlogs,
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleVisibility() {
        try {
            const res = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/change-saved-liked-blog-visibility`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            dispatch(updateData(["visibility", data]));
            toast.success(res.data.message);
            navigate(-1);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    if (!token) return <Navigate to={"/signin"} />;

    return (
        <div className="min-h-[calc(100vh_-_250px)] flex items-center justify-center p-5">
            <div className="w-full max-w-xl  rounded-2xl  p-8 transition-all duration-300">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        Show Saved Blogs?
                    </label>
                    <select
                        value={data.showSavedBlogs}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                showSavedBlogs: e.target.value === "true",
                            }))
                        }
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        Show Liked Blogs?
                    </label>
                    <select
                        value={data.showLikedBlogs}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                showLikedBlogs: e.target.value === "true",
                            }))
                        }
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <button
                    onClick={handleVisibility}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-full transition-all"
                >
                    Update Settings
                </button>
            </div>
        </div>
    );
}

export default Setting;
