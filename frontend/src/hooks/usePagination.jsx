import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useLoader from "./useLoader";

function usePagination(path, queryParams = {}, limit = 1, page = 1) {
    const [hasMore, setHasMore] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const [isLoading, startLoading, stopLoading] = useLoader();
    useEffect(() => {
        async function fetchSeachBlogs() {
            try {
                startLoading();
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${path}`, {
                    params: { ...queryParams, limit, page },
                });
                console.log(res);
                const blogList = Array.isArray(res?.data?.blogs) ? res.data.blogs : [];
                setBlogs((prev) => [...prev, ...blogList]);

                setHasMore(Boolean(res?.data?.hasMore));
            } catch (error) {
                navigate(-1);
                setBlogs([]);
                toast.error(error?.response?.data?.message || "Something went wrong");
                setHasMore(false);
            } finally {
                stopLoading();
            }
        }
        fetchSeachBlogs();
    }, []);

    return { blogs, hasMore, isLoading };
}

export default usePagination;
