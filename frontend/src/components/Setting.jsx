import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { updateData } from "../utils/userSilce";
import { applyTheme, getCurrentTheme } from "../utils/theme";
import {
    Settings,
    Lock,
    Eye,
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
    const [selectedTheme, setSelectedTheme] = useState("light");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Initialize theme on component mount
    useEffect(() => {
        const savedThemePreference = localStorage.getItem("theme") || "system";
        setSelectedTheme(savedThemePreference);
    }, []);

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

    function handleSavePreferences() {
        const appliedTheme = applyTheme(selectedTheme);
        setSelectedTheme(selectedTheme); // Keep the preference (might be "system")
        toast.success(`Theme set to ${appliedTheme}`);
    }

    if (!token) return <Navigate to="/signin" />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-darkbg dark:to-darkbg py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 dark:text-darktext dark:hover:text-accent mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-darkbg">
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-darktext flex items-center gap-2">
                                    <Settings className="text-indigo-600 dark:text-accent" />
                                    Settings
                                </h1>
                            </div>
                            <nav className="space-y-1 px-2 pb-4">
                                <button
                                    onClick={() => setActiveTab("privacy")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${activeTab === "privacy"
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-darkbg dark:text-accent"
                                        : "text-gray-700 hover:bg-gray-50 dark:text-darktext dark:hover:bg-darkbg"
                                        }`}
                                >
                                    <Lock className="w-5 h-5" />
                                    <span>Privacy Settings</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("interface")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${activeTab === "interface"
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-darkbg dark:text-accent"
                                        : "text-gray-700 hover:bg-gray-50 dark:text-darktext dark:hover:bg-darkbg"
                                        }`}
                                >
                                    <Eye className="w-5 h-5" />
                                    <span>Interface Preferences</span>
                                </button>
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-6 md:p-8 text-gray-900 dark:text-darktext">
                            {activeTab === "privacy" && (
                                <>
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        <Eye className="text-indigo-600 dark:text-accent" />
                                        Privacy Settings
                                    </h2>

                                    <div className="space-y-6">
                                        {["Saved", "Liked"].map((label) => {
                                            const key = `show${label}Blogs`;
                                            return (
                                                <div key={key}>
                                                    <label className="block text-sm font-medium mb-2">
                                                        Show {label} Blogs on Profile
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={data[key]}
                                                            onChange={(e) =>
                                                                setData((prev) => ({
                                                                    ...prev,
                                                                    [key]: e.target.value === "true",
                                                                }))
                                                            }
                                                            className="appearance-none w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-darkbg bg-white dark:bg-darkbg text-black dark:text-darktext rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        >
                                                            <option value="true">Visible to everyone</option>
                                                            <option value="false">Only visible to me</option>
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        Control who can see your {label.toLowerCase()} blog posts
                                                    </p>
                                                </div>
                                            );
                                        })}

                                        <button
                                            onClick={handleVisibility}
                                            disabled={isLoading}
                                            className={`w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-accent dark:hover:bg-indigo-400 text-white font-medium rounded-lg transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {isLoading ? "Saving..." : "Save Privacy Settings"}
                                        </button>
                                    </div>
                                </>
                            )}

                            {activeTab === "interface" && (
                                <>
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        <Eye className="text-indigo-600 dark:text-accent" />
                                        Interface Preferences
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Theme
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedTheme}
                                                    onChange={(e) => setSelectedTheme(e.target.value)}
                                                    className="appearance-none w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-darkbg bg-white dark:bg-darkbg text-black dark:text-darktext rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="light">Light Mode</option>
                                                    <option value="dark">Dark Mode</option>
                                                    <option value="system">System Default</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                Current applied theme: {getCurrentTheme()}
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleSavePreferences}
                                            className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-accent dark:hover:bg-indigo-400 text-white font-medium rounded-lg transition-colors"
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