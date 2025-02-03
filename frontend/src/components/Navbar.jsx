import React from "react";
import { Outlet } from "react-router-dom";
import { Bell, Edit2, Search } from "lucide-react";

const Navbar = () => {
    return (
        <>
            <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
                {/* Left Section - Brand Logo */}
                <div className="text-2xl font-serif font-bold text-gray-800">Blog App</div>

                {/* Center Section - Search Bar */}
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/2">
                    <Search className="w-4 h-4 text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-sm text-gray-700 w-full"
                    />
                </div>

                {/* Right Section - Icons and Profile */}
                <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900">
                        <Edit2 className="w-5 h-5" />
                        <span>Write</span>
                    </button>
                    <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
                    <img
                        src="/path/to/profile.jpg"
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover cursor-pointer"
                    />
                </div>
            </nav>

            {/* Outlet for Nested Routes */}
            <div className="p-4">
                <Outlet />
            </div>
        </>
    );
};

export default Navbar;
