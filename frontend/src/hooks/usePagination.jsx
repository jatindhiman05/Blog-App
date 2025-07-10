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
        async function fetchSearchBlogs() {
            try {
                startLoading();
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${path}`, {
                    params: { ...queryParams, limit, page },
                });

                const blogList = Array.isArray(res?.data?.blogs) ? res.data.blogs : [];
                setBlogs((prev) => (page === 1 ? blogList : [...prev, ...blogList]));
                setHasMore(Boolean(res?.data?.hasMore));
            } catch (error) {
                if (page === 1) navigate(-1);
                toast.error(error?.response?.data?.message || "Something went wrong");
                setHasMore(false);
            } finally {
                stopLoading();
            }
        }

        fetchSearchBlogs();
    }, [path, JSON.stringify(queryParams), page]);

    return { blogs, hasMore, isLoading };
}

export default usePagination;
