const express = require('express');
const { getAllBlogs, getBlogByID, addBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const verifyUser = require('../middlewares/auth');
const route = express.Router();

route.get('/blogs',getAllBlogs);

route.get('/blogs/:id', getBlogByID);

route.post('/blogs', verifyUser,addBlog);

route.patch('/blogs/:id', verifyUser, updateBlog);

route.delete('/blogs/:id',verifyUser,deleteBlog);

module.exports = route