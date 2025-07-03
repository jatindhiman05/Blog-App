import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { updateData } from "../utils/userSilce";
import {
    Settings,
    Lock,
    Eye,
    EyeOff,
    ChevronDown,
    ArrowLeft,
} from "lucide-react";

function Setting() {
    const { token, id: userId, showLikedBlogs, showSavedBlogs } = useSelector(
        (state) => state.user
    );

    const [data, setData] = useState({
        showLikedBlogs,
        showSavedBlogs,
    });
    const [activeTab, setActiveTab] = useState("privacy");
    const [isLoading, setIsLoading] = useState(false);

    const [theme, setTheme] = useState("light");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleVisibility() {
        setIsLoading(true);
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
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    }

    if (!token) return <Navigate to="/signin" />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar Navigation */}
                        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Settings className="text-indigo-600" />
                                    Settings
                                </h1>
                            </div>
                            <nav className="space-y-1 px-2 pb-4">
                                <button
                                    onClick={() => setActiveTab("privacy")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${activeTab === "privacy"
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <Lock className="w-5 h-5" />
                                    <span>Privacy Settings</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("interface")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${activeTab === "interface"
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <Eye className="w-5 h-5" />
                                    <span>Interface Preferences</span>
                                </button>
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-6 md:p-8">
                            {activeTab === "privacy" && (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                        <Eye className="text-indigo-600" />
                                        Privacy Settings
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Show Saved Blogs on Profile
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={data.showSavedBlogs}
                                                    onChange={(e) =>
                                                        setData((prev) => ({
                                                            ...prev,
                                                            showSavedBlogs: e.target.value === "true",
                                                        }))
                                                    }
                                                    className="appearance-none w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="true">Visible to everyone</option>
                                                    <option value="false">Only visible to me</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Control who can see your saved blog posts
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Show Liked Blogs on Profile
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={data.showLikedBlogs}
                                                    onChange={(e) =>
                                                        setData((prev) => ({
                                                            ...prev,
                                                            showLikedBlogs: e.target.value === "true",
                                                        }))
                                                    }
                                                    className="appearance-none w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="true">Visible to everyone</option>
                                                    <option value="false">Only visible to me</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Control who can see the blogs you've liked
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleVisibility}
                                            disabled={isLoading}
                                            className={`w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {isLoading ? "Saving..." : "Save Privacy Settings"}
                                        </button>
                                    </div>
                                </>
                            )}

                            {activeTab === "interface" && (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                        <Eye className="text-indigo-600" />
                                        Interface Preferences
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Theme
                                            </label>
                                            <select
                                                value={theme}
                                                onChange={(e) => setTheme(e.target.value)}
                                                className="appearance-none w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="light">Light Mode</option>
                                                <option value="dark">Dark Mode</option>
                                                <option value="system">System Default</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <ChevronDown className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Choose your preferred interface theme.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => toast.success("Preferences saved locally")}
                                            className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Save Preferences
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Setting;
