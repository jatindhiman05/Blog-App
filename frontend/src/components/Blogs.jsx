import React, { useEffect, useState } from 'react';

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  async function fetchBlogs() {
    const response = await fetch('http://localhost:3000/api/v1/blogs');
    const res = await response.json();

    setBlogs(res.blogs || []);
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1>Blogs</h1>
      <ul>
        {blogs.map((blog, index) => (
          <li key={index}>
            <h2>{blog.title}</h2>
            <p>{blog.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Blogs;