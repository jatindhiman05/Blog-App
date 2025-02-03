import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddBlog = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const navigate = useNavigate();
    const { id } = useParams();


    const [blogData, setBlogData] = useState({
        title: "",
        description: "",
        image: null,
    });


    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    if (!token) return <Navigate to="/signin" />;

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setBlogData({ ...blogData, [id]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setBlogData({ ...blogData, image: file });

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", blogData.title);
            formData.append("description", blogData.description);
            if (blogData.image) formData.append("image", blogData.image);

            let res;
            if (id) {
                res = await axios.patch(`http://localhost:3000/api/v1/blogs/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                res = await axios.post('http://localhost:3000/api/v1/blogs', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            console.log(res);
            toast.success(res.data.message);
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            (async function fetchBlogById() {
                try {
                    let res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
                    setBlogData({
                        title: res.data.blog.title,
                        description: res.data.blog.description,
                        image: res.data.blog.image, // Store the image URL
                    });

                    // Set image preview if an existing image URL is present
                    if (res.data.blog.image) {
                        setImagePreview(res.data.blog.image);
                    }
                } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to load blog");
                }
            })();
        }
    }, [id]);


    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-950 text-center">{id ? "Edit Blog" : "Create a New Blog"}</h2>
                <p className="mt-2 text-sm text-gray-800 text-center">{id ? "Modify your blog details" : "Share your thoughts with the world"}</p>

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-900">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter blog title"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-700 focus:ring-blue-700 sm:text-sm"
                            value={blogData.title}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900">Description</label>
                        <textarea
                            id="description"
                            rows="3"
                            placeholder="Write a short description"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-700 focus:ring-blue-700 sm:text-sm"
                            value={blogData.description}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-900">Upload Image</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            className="mt-1 block w-full text-gray-700 bg-gray-50 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 sm:text-sm"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </div>

                    {imagePreview && (
                        <div className="mt-4">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md border" />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-gray-800 hover:bg-gray-900 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : id ? "Update Blog" : "Publish Blog"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBlog;
