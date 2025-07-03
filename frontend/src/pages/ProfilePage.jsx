import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useParams, useNavigate } from "react-router-dom";
import { handleFollowCreator } from "./BlogPage";
import { useSelector, useDispatch } from "react-redux";
import DisplayBlogs from "../components/DisplayBlogs";
import { Bookmark, Heart, Home, PenSquare, UserPlus, Users, Calendar, Clock, FileText, BookOpen, ChevronRight, MoreHorizontal, ArrowLeft } from "lucide-react";

function ProfilePage() {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { token, id: userId, following } = useSelector((state) => state.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function renderComponent() {
        if (location.pathname === `/${username}`) {
            return (
                <DisplayBlogs blogs={userData.blogs.filter((blog) => !blog.draft)} />
            );
        } else if (location.pathname === `/${username}/saved-blogs`) {
            return (
                <>
                    {userData.showSavedBlogs || userData._id === userId ? (
                        <DisplayBlogs blogs={userData.saveBlogs} />
                    ) : (
                        <Navigate to={`/${username}`} />
                    )}
                </>
            );
        } else if (location.pathname === `/${username}/draft-blogs`) {
            return (
                <>
                    {userData._id === userId ? (
                        <DisplayBlogs blogs={userData.blogs.filter((blog) => blog.draft)} />
                    ) : (
                        <Navigate to={`/${username}`} />
                    )}
                </>
            );
        } else {
            return (
                <>
                    {userData.showLikedBlogs || userData._id === userId ? (
                        <DisplayBlogs blogs={userData.likeBlogs} />
                    ) : (
                        <Navigate to={`/${username}`} />
                    )}
                </>
            );
        }
    }

    useEffect(() => {
        async function fetchUserDetails() {
            try {
                setIsLoading(true);
                let res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/users/${username.split("@")[1]}`
                );
                setUserData(res.data.user);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        }
        fetchUserDetails();
    }, [username]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="py-12 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto animate-pulse">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-32 h-32 rounded-full bg-gray-100"></div>
                            <div className="flex-1 space-y-4">
                                <div className="h-8 w-64 bg-gray-100 rounded"></div>
                                <div className="h-4 w-32 bg-gray-100 rounded"></div>
                                <div className="h-4 w-48 bg-gray-100 rounded"></div>
                                <div className="flex gap-4">
                                    <div className="h-4 w-24 bg-gray-100 rounded"></div>
                                    <div className="h-4 w-24 bg-gray-100 rounded"></div>
                                </div>
                                <div className="h-10 w-32 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">User not found</h2>
                    <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or may have been removed.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Return to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Header */}
            <div className="bg-white py-12 px-4 sm:px-6 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button - Added similar to Settings component */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                                <img
                                    src={
                                        userData.profilePic
                                            ? userData.profilePic
                                            : `https://api.dicebear.com/9.x/initials/svg?seed=${userData.name}`
                                    }
                                    alt={userData.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {userData._id === userId && (
                                <Link
                                    to="/edit-profile"
                                    className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors border border-gray-200 hover:shadow-lg"
                                >
                                    <PenSquare className="w-5 h-5" />
                                </Link>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                                <p className="text-gray-500">@{username.split("@")[1]}</p>
                            </div>

                            {userData.bio && (
                                <p className="text-gray-600 max-w-lg mx-auto md:mx-0">{userData.bio}</p>
                            )}

                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full">
                                    <Users className="w-4 h-4 text-indigo-500" />
                                    <span className="text-sm">
                                        <span className="font-medium">{userData.followers.length}</span> followers
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full">
                                    <UserPlus className="w-4 h-4 text-indigo-500" />
                                    <span className="text-sm">
                                        <span className="font-medium">{userData.following.length}</span> following
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full">
                                    <BookOpen className="w-4 h-4 text-indigo-500" />
                                    <span className="text-sm">
                                        <span className="font-medium">{userData.blogs.filter(blog => !blog.draft).length}</span> posts
                                    </span>
                                </div>
                            </div>

                            {userId !== userData._id && (
                                <div className="flex gap-3 justify-center md:justify-start">
                                    <button
                                        onClick={() => handleFollowCreator(userData._id, token, dispatch)}
                                        className={`mt-2 px-6 py-2.5 rounded-full font-medium flex items-center gap-2 mx-auto md:mx-0 transition-all shadow-sm hover:shadow-md ${following.includes(userData._id)
                                            ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                            }`}
                                    >
                                        {following.includes(userData._id) ? "Following" : "Follow"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rest of the component remains unchanged */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-200">
                            <nav className="flex overflow-x-auto">
                                <Link
                                    to={`/${username}`}
                                    className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors ${location.pathname === `/${username}`
                                        ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                                        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <Home className="w-5 h-5" />
                                    <span>Blogs</span>
                                </Link>

                                {(userData.showSavedBlogs || userData._id === userId) && (
                                    <Link
                                        to={`/${username}/saved-blogs`}
                                        className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors ${location.pathname === `/${username}/saved-blogs`
                                            ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                                            : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Bookmark className="w-5 h-5" />
                                        <span>Saved</span>
                                    </Link>
                                )}

                                {(userData.showLikedBlogs || userData._id === userId) && (
                                    <Link
                                        to={`/${username}/liked-blogs`}
                                        className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors ${location.pathname === `/${username}/liked-blogs`
                                            ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                                            : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Heart className="w-5 h-5" />
                                        <span>Liked</span>
                                    </Link>
                                )}

                                {userData._id === userId && (
                                    <Link
                                        to={`/${username}/draft-blogs`}
                                        className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors ${location.pathname === `/${username}/draft-blogs`
                                            ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                                            : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span>Drafts</span>
                                    </Link>
                                )}
                            </nav>
                        </div>

                        {/* Content Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {renderComponent()}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-80 space-y-6">
                        {/* Stats Section */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-600" />
                                    <span>Activity Stats</span>
                                </h2>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors">
                                    <p className="text-2xl font-bold text-indigo-600">{userData.blogs.filter(blog => !blog.draft).length}</p>
                                    <p className="text-sm text-gray-600">Published</p>
                                </div>
                                {userData._id === userId && (
                                    <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors">
                                        <p className="text-2xl font-bold text-purple-600">{userData.blogs.filter(blog => blog.draft).length}</p>
                                        <p className="text-sm text-gray-600">Drafts</p>
                                    </div>
                                )}
                                <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 hover:border-green-200 transition-colors">
                                    <p className="text-2xl font-bold text-green-600">{userData.likeBlogs.length}</p>
                                    <p className="text-sm text-gray-600">Liked</p>
                                </div>
                                <div className="bg-yellow-50/50 p-4 rounded-lg border border-yellow-100 hover:border-yellow-200 transition-colors">
                                    <p className="text-2xl font-bold text-yellow-600">{userData.saveBlogs.length}</p>
                                    <p className="text-sm text-gray-600">Saved</p>
                                </div>
                            </div>
                        </div>

                        {/* Following Section */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                    <span>Following</span>
                                </h2>
                            </div>
                            <div className="p-6">
                                {userData.following.length > 0 ? (
                                    <div className="space-y-3">
                                        {userData.following.slice(0, 5).map((user) => (
                                            <Link
                                                key={user._id}
                                                to={`/@${user.username}`}
                                                className="flex items-center justify-between p-3 hover:bg-indigo-50 rounded-lg transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                                        <img
                                                            src={
                                                                user.profilePic
                                                                    ? user.profilePic
                                                                    : `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`
                                                            }
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 group-hover:text-indigo-600">{user.name}</p>
                                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                            </Link>
                                        ))}
                                        {userData.following.length > 5 && (
                                            <Link
                                                to={`/${username}/following`}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center gap-1 mt-2"
                                            >
                                                View all ({userData.following.length})
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Not following anyone yet</p>
                                )}
                            </div>
                        </div>

                        {/* Member Since */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                    <span>Member Since</span>
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span>
                                        {new Date(userData.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;