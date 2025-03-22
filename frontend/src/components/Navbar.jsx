import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../../public/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../utils/userSilce";
import {
    Search,
    PencilLine,
    UserCircle2,
    Settings,
    LogOut,
} from "lucide-react";

const Navbar = () => {
    const { token, name, profilePic, username } = useSelector(
        (state) => state.user
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchBar, setShowSearchBar] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        setShowPopup(false);
    };

    useEffect(() => {
        if (window.location.pathname !== "/search") {
            setSearchQuery("");
        }

        return () => {
            if (window.location.pathname !== "/") {
                setShowPopup(false);
            }
        };
    }, [window.location.pathname]);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center h-[70px]">
                    {/* Logo and Search */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logo} alt="logo" className="h-8 w-auto" />
                            <span className="text-xl font-bold text-indigo-600">Blogify</span>
                        </Link>

                        {/* Desktop Search */}
                        <div
                            className={`relative transition-all duration-300 ease-in-out max-sm:absolute max-sm:top-16 max-sm:w-full ${showSearchBar ? "max-sm:block" : "max-sm:hidden"} sm:block`}
                        >
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && searchQuery.trim()) {
                                        navigate(`/search?q=${searchQuery.trim()}`);
                                        setSearchQuery("");
                                        setShowSearchBar(false);
                                    }
                                }}
                                className="w-full sm:w-80 bg-white/60 backdrop-blur-sm text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-full pl-10 pr-4 py-2 placeholder:text-slate-400 shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setShowSearchBar((prev) => !prev)}
                            className="sm:hidden text-slate-500 hover:text-slate-700 transition"
                        >
                            <Search size={24} />
                        </button>

                        {/* Write Blog */}
                        {token && (
                            <Link to="/add-blog">
                                <button className="flex items-center gap-2 text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-5 py-2 text-sm font-medium rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-300">
                                    <PencilLine size={18} />
                                    <span className="hidden sm:inline">Write</span>
                                </button>
                            </Link>
                        )}

                        {/* Profile / Auth */}
                        {token ? (
                            <div className="relative">
                                <img
                                    src={
                                        profilePic ||
                                        `https://api.dicebear.com/9.x/initials/svg?seed=${name}`
                                    }
                                    alt={name}
                                    onClick={() => setShowPopup((prev) => !prev)}
                                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300 hover:ring-indigo-500 cursor-pointer transition-all"
                                />

                                {showPopup && (
                                    <div
                                        onMouseLeave={() => setShowPopup(false)}
                                        className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden animate-fadeIn"
                                    >
                                        <Link
                                            to={`/@${username}`}
                                            className="flex items-center gap-2 px-5 py-3 hover:bg-slate-100 text-slate-700 transition-all"
                                        >
                                            <UserCircle2 size={18} />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            to={`/edit-profile`}
                                            className="flex items-center gap-2 px-5 py-3 hover:bg-slate-100 text-slate-700 transition-all"
                                        >
                                            <Settings size={18} />
                                            <span>Edit Profile</span>
                                        </Link>
                                        <Link
                                            to={"/setting"}
                                            className="flex items-center gap-2 px-5 py-3 hover:bg-slate-100 text-slate-700 transition-all"
                                        >
                                            <Settings size={18} />
                                            <span>Settings</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full gap-2 px-5 py-3 text-red-600 hover:bg-red-50 active:scale-95 transition-all duration-300"
                                        >
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/signup">
                                    <button className="flex items-center gap-2 text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-5 py-2 text-sm font-medium rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-300">
                                        Sign Up
                                    </button>
                                </Link>
                                <Link to="/signin">
                                    <button className="border border-slate-300 text-slate-700 hover:bg-slate-100 px-5 py-2 text-sm font-medium rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all duration-300">
                                        Sign In
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-[70px] min-h-screen bg-slate-50">
                <Outlet />
            </main>
        </>
    );
};

export default Navbar;
