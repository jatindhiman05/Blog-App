import React from "react";
import { Link } from "react-router-dom";
import { Target, Globe2 } from "lucide-react";

function AboutPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        About Me
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Sharing knowledge and stories that inspire developers to build better web experiences.
                    </p>
                </section>

                {/* Mission Section */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-16">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Target className="text-blue-600" /> My Mission
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                My mission is to empower web developers through high-quality content, tutorials, and personal stories from the tech community. I believe in continuous learning and sharing knowledge to grow together.
                            </p>
                        </div>
                        <div className="flex-1">
                            <img
                                src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=60"
                                alt="Mission Illustration"
                                className="rounded-xl shadow-md w-full object-cover h-64"
                            />
                        </div>
                    </div>
                </section>

                {/* About Me Section */}
                <section className="mb-16 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8">About Me</h2>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 inline-block">
                        <img
                            src="https://res.cloudinary.com/df19wbn0d/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1743484881/WhatsApp_Image_2025-01-18_at_23.23.17_bc50be96_shaq4m.jpg"
                            alt="My Photo"
                            className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">Jatin Dhiman</h3>
                        <p className="text-gray-500 text-sm mb-2">Developer</p>
                        <p className="text-gray-600 text-sm">
                            Passionate about building modern web applications and sharing knowledge with the developer community.
                        </p>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="text-center mt-20">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-center items-center gap-2">
                        <Globe2 className="text-blue-600" /> Join My Community
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Whether you're here to learn, share, or connect, I welcome you to be part of my growing community.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition duration-300"
                    >
                        Get Started
                    </Link>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;