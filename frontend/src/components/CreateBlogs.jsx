import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

function CreateBlogs() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const [blogData, setBlogData] = useState({
    title: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!token) {
    return <Navigate to="/signup" />;
  }

  async function handleSubmit() {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:3000/api/v1/blogs', {
        method: 'POST',
        body: JSON.stringify(blogData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (response.ok) {
        setMessage('Blog created successfully!');
        setBlogData({ title: '', description: '' }); // Reset form
      } else {
        setMessage(res.message || 'Failed to create blog.');
      }
    } catch (error) {
      setMessage('Network error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1>CREATE BLOG</h1>
      <input
        type="text"
        placeholder="title"
        value={blogData.title}
        onChange={(e) =>
          setBlogData((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <br />
      <br />
      <input
        type="text"
        placeholder="description"
        value={blogData.description}
        onChange={(e) =>
          setBlogData((prev) => ({ ...prev, description: e.target.value }))
        }
      />
      <br />
      <br />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
      {message && <p>{message}</p>}
    </>
  );
}

export default CreateBlogs;
