const express = require('express');
const { getAllBlogs, getBlogByID, addBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const route = express.Router();

route.get('/blogs',getAllBlogs);

route.get('/blogs/:id', getBlogByID);

route.post('/blogs', addBlog);

route.patch('/blogs/:id', updateBlog);

route.delete('/blogs/:id',deleteBlog);

module.exports = route