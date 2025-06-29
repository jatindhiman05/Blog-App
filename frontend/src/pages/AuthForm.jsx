import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSilce";
import Input from "../components/Input";
import googleIcon from "../assets/google-icon-logo-svgrepo-com.svg";
import { googleAuth, handleRedirectResult } from "../utils/firebase";

function AuthForm({ type }) {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleAuthForm(e) {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/${type}`,
                userData
            );

            if (type === "signup") {
                toast.success(res.data.message);
                navigate("/signin");
            } else {
                dispatch(login(res.data.user));
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setUserData({ name: "", email: "", password: "" });
        }
    }

    async function handleGoogleAuth() {
        try {
            let userData = await googleAuth();
            if (!userData) return;

            const idToken = await userData.getIdToken();

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/google-auth`,
                { accessToken: idToken }
            );

            dispatch(login(res.data.user));
            toast.success(res.data.message);
            navigate("/");
        } catch (error) {
            console.error("Google Auth Error:", error);
            toast.error(error.response?.data?.message || "Authentication failed");
        }
    }

    useEffect(() => {
        const handleRedirect = async () => {
            try {
                const userData = await handleRedirectResult();
                if (userData) {
                    const idToken = await userData.getIdToken();
                    const res = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/google-auth`,
                        { accessToken: idToken }
                    );
                    dispatch(login(res.data.user));
                    toast.success(res.data.message);
                    navigate("/");
                }
            } catch (error) {
                console.error("Redirect Error:", error);
                toast.error("Authentication failed");
            }
        };

        handleRedirect();
    }, [dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8 transition-all duration-300">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    {type === "signin" ? "Sign in to your account" : "Create a new account"}
                </h1>

                <form onSubmit={handleAuthForm} className="flex flex-col space-y-4">
                    {type === "signup" && (
                        <Input
                            type="text"
                            placeholder="Full Name"
                            setUserData={setUserData}
                            field="name"
                            value={userData.name}
                            icon="fi-br-user"
                        />
                    )}

                    <Input
                        type="email"
                        placeholder="Email Address"
                        setUserData={setUserData}
                        field="email"
                        value={userData.email}
                        icon="fi-rr-at"
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        setUserData={setUserData}
                        field="password"
                        value={userData.password}
                        icon="fi-rr-lock"
                    />

                    <button
                        type="submit"
                        className="w-full py-2.5 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {type === "signin" ? "Sign In" : "Register"}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm text-gray-500">
                        <span className="bg-white px-2">or</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleAuth}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <img src={googleIcon} alt="Google" className="w-5 h-5" />
                    Continue with Google
                </button>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {type === "signin" ? (
                        <>
                            Don’t have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-indigo-600 hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link
                                to="/signin"
                                className="text-indigo-600 hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

export default AuthForm;
