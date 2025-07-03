import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../utils/userSilce";
import {
    Search,
    PenSquare,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Loader2
} from "lucide-react";

const Navbar = () => {
    const { token, name, profilePic, username } = useSelector(
        (state) => state.user
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const popupRef = useRef(null);

    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            dispatch(logout());
            setShowPopup(false);
            setMobileMenuOpen(false);
            setIsLoggingOut(false);
            navigate('/');
            window.location.reload();
        }, 1000);
    };

    useEffect(() => {
        if (window.location.pathname !== "/search") {
            setSearchQuery("");
        }
    }, [window.location.pathname]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                const profileButton = document.querySelector('.profile-button');
                if (!profileButton || !profileButton.contains(event.target)) {
                    setShowPopup(false);
                }
            }
        }

        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopup]);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-darkbg shadow-sm dark:shadow-gray-800/50 border-gray-200 dark:border-darkborder">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    {/* Left section - Logo + Search */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-accent dark:to-indigo-400 flex items-center justify-center text-white font-bold shadow-sm">
                                JD
                            </div>
                            <span className="hidden sm:block text-lg font-semibold text-gray-900 dark:text-darktext">
                                Journal
                            </span>
                        </Link>

                        {/* Desktop Search */}
                        <div className="hidden md:block relative w-72">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 dark:text-darktext/70" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && searchQuery.trim()) {
                                        navigate(`/search?q=${searchQuery.trim()}`);
                                        setSearchQuery("");
                                    }
                                }}
                                className="w-full bg-gray-50 dark:bg-darkcard text-sm text-gray-800 dark:text-darktext focus:ring-1 focus:ring-indigo-500 dark:focus:ring-accent focus:outline-none rounded-lg pl-10 pr-4 py-2 placeholder:text-gray-400 dark:placeholder:text-darktext/70  border-gray-300 dark:border-darkborder hover:border-indigo-300 dark:hover:border-accent transition-all"
                            />
                        </div>
                    </div>

                    {/* Mobile menu buttons */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={() => setShowSearchBar(!showSearchBar)}
                            className="text-gray-600 dark:text-darktext/80 hover:text-indigo-600 dark:hover:text-accent p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-darkbg transition-colors"
                        >
                            <Search size={20} />
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-600 dark:text-darktext/80 hover:text-indigo-600 dark:hover:text-accent p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-darkbg transition-colors"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Desktop Navigation and Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {token ? (
                            <>
                                <Link
                                    to="/add-blog"
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-accent dark:hover:bg-indigo-500 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm"
                                >
                                    <PenSquare size={16} />
                                    <span>Write</span>
                                </Link>

                                <div className="relative ml-2" ref={popupRef}>
                                    <button
                                        onClick={() => setShowPopup(!showPopup)}
                                        className="flex items-center gap-1 focus:outline-none group profile-button"
                                    >
                                        <img
                                            src={
                                                profilePic ||
                                                `https://api.dicebear.com/7.x/initials/svg?seed=${name}&background=indigo`
                                            }
                                            alt={name}
                                            className="w-8 h-8 rounded-full object-cover  border-gray-200 dark:border-darkborder group-hover:border-indigo-400 dark:group-hover:border-accent cursor-pointer transition-all"
                                        />
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-500 dark:text-darktext/70 transition-transform ${showPopup ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {showPopup && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-darkcard rounded-lg shadow-md  border-gray-200 dark:border-darkborder overflow-hidden z-50">
                                            <div className="px-4 py-3  border-gray-200 dark:border-darkborder">
                                                <p className="text-sm font-medium text-gray-900 dark:text-darktext">{name}</p>
                                                <p className="text-xs text-gray-500 dark:text-darktext/70">@{username}</p>
                                            </div>
                                            <Link
                                                to={`/@${username}`}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-darkbg text-gray-700 dark:text-darktext text-sm transition-colors"
                                                onClick={() => setShowPopup(false)}
                                            >
                                                <User size={16} className="text-indigo-500 dark:text-accent" />
                                                <span>Profile</span>
                                            </Link>
                                            <Link
                                                to="/setting"
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-darkbg text-gray-700 dark:text-darktext text-sm transition-colors"
                                                onClick={() => setShowPopup(false)}
                                            >
                                                <Settings size={16} className="text-indigo-500 dark:text-accent" />
                                                <span>Settings</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-darkbg text-sm transition-colors  border-gray-200 dark:border-darkborder"
                                                disabled={isLoggingOut}
                                            >
                                                {isLoggingOut ? (
                                                    <Loader2 size={16} className="animate-spin text-red-500 dark:text-red-300" />
                                                ) : (
                                                    <LogOut size={16} className="text-red-500 dark:text-red-300" />
                                                )}
                                                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/signin">
                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-darktext hover:text-indigo-600 dark:hover:text-accent hover:bg-gray-50 dark:hover:bg-darkbg rounded-lg transition-colors">
                                        Sign In
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-accent dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-colors">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile search bar */}
                {showSearchBar && (
                    <div className="md:hidden px-4 py-3 bg-white dark:bg-darkbg  border-gray-200 dark:border-darkborder">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 dark:text-darktext/70" />
                            </div>
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
                                className="w-full bg-gray-50 dark:bg-darkcard text-sm text-gray-800 dark:text-darktext focus:ring-1 focus:ring-indigo-500 dark:focus:ring-accent focus:outline-none rounded-lg pl-10 pr-4 py-2 placeholder:text-gray-400 dark:placeholder:text-darktext/70 border border-gray-300 dark:border-darkborder hover:border-indigo-300 dark:hover:border-accent transition-all"
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-darkbg  border-gray-200 dark:border-darkborder shadow-sm">
                        <div className="px-4 py-3 space-y-2">
                            {token ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-3  border-b border-gray-200 dark:border-darkborder">
                                        <img
                                            src={
                                                profilePic ||
                                                `https://api.dicebear.com/7.x/initials/svg?seed=${name}&background=indigo`
                                            }
                                            alt={name}
                                            className="w-10 h-10 rounded-full object-cover  border-gray-200 dark:border-darkborder"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-darktext">{name}</p>
                                            <p className="text-xs text-gray-500 dark:text-darktext/70">@{username}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/@${username}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-darktext rounded-lg hover:bg-gray-50 dark:hover:bg-darkbg"
                                    >
                                        <User size={16} className="text-indigo-500 dark:text-accent" />
                                        <span>Profile</span>
                                    </Link>
                                    <Link
                                        to="/add-blog"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-darktext rounded-lg hover:bg-gray-50 dark:hover:bg-darkbg"
                                    >
                                        <PenSquare size={16} />
                                        <span>Write Article</span>
                                    </Link>
                                    <Link
                                        to="/setting"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-darktext rounded-lg hover:bg-gray-50 dark:hover:bg-darkbg"
                                    >
                                        <Settings size={16} className="text-indigo-500 dark:text-accent" />
                                        <span>Settings</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-darkbg mt-2"
                                        disabled={isLoggingOut}
                                    >
                                        {isLoggingOut ? (
                                            <Loader2 size={16} className="animate-spin text-red-500 dark:text-red-300" />
                                        ) : (
                                            <LogOut size={16} className="text-red-500 dark:text-red-300" />
                                        )}
                                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/signin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2.5 text-center text-sm font-medium text-gray-700 dark:text-darktext hover:bg-gray-50 dark:hover:bg-darkbg rounded-lg"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2.5 text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-accent dark:hover:bg-indigo-500 rounded-lg shadow-sm"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main className="pt-16 min-h-screen bg-gray-50 dark:bg-darkbg">
                <Outlet />
            </main>
        </>
    );
};

export default Navbar;