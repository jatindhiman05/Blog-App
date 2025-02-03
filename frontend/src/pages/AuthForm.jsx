import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function AuthForm({ type }) {
    const [userData, setUserData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setUserData({ name: "", email: "", password: "" });
    }, [type]);

    function handleChange(e) {
        const { id, value } = e.target;
        setUserData((prev) => ({ ...prev, [id]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!userData.email || !userData.password || (type === "signup" && !userData.name)) {
            toast.error("All fields are required!");
            return;
        }

        setLoading(true); 

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const res = await axios.post(`${API_URL}/api/v1/${type}`, userData);

            if (res.data?.user && res.data?.token) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", JSON.stringify(res.data.token));
                navigate(type === "signup" ? "/signin" : "/");
            }

            toast.success(res.data.message || "Success!");
        } catch (error) {
            const errMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-950 text-center">
                    {type === "signin" ? "Sign In" : "Sign Up"}
                </h2>
                <p className="mt-2 text-sm text-gray-800 text-center">
                    {type === "signup" ? "Create your account to get started" : "Welcome back! Log in to continue"}
                </p>

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    {type === "signup" && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="John Doe"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-700 focus:ring-blue-700 sm:text-sm"
                                value={userData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-700 focus:ring-gray-700 sm:text-sm"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-700 focus:ring-gray-700 sm:text-sm"
                            value={userData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-gray-800 hover:bg-gray-900 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : type === "signin" ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-800">
                    {type === "signin" ? (
                        <>
                            Don't have an account?{" "}
                            <Link className="text-gray-700 hover:text-gray-900 font-medium" to="/signup">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link className="text-gray-800 hover:text-gray-900 font-medium" to="/signin">
                                Log In
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

export default AuthForm;
