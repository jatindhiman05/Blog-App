import React, { useState } from "react";

function Input({ type, placeholder, value, setUserData, field, icon }) {
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        setUserData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    return (
        <div className="relative w-full font-sans">
            {/* Left Icon */}
            {icon && (
                <i
                    className={`fi ${icon} absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-base`}
                />
            )}

            {/* Input field */}
            <input
                type={type !== "password" ? type : showPassword ? "text" : type}
                value={value}
                placeholder={placeholder}
                onChange={handleInputChange}
                className="w-full h-[44px] pl-10 pr-10 text-sm text-gray-800 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 outline-none bg-white placeholder-gray-400 font-sans"
            />

            {/* Password toggle icon */}
            {type === "password" && (
                <i
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={`fi ${showPassword ? "fi-rs-eye" : "fi-rs-crossed-eye"} absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 text-base cursor-pointer`}
                />
            )}
        </div>
    );
}

export default Input;
