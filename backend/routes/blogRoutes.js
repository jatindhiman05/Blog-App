const express = require('express');
const { getAllBlogs, getBlogByID, addBlog, updateBlog, deleteBlog, likeBlog } = require('../controllers/blogController');
const verifyUser = require('../middlewares/auth');
const { addComment, deleteComment, editComment, likeComment } = require('../controllers/commentController');
const upload = require('../utils/multer');
const route = express.Router();

route.get('/blogs',getAllBlogs);

route.get('/blogs/:blogId', getBlogByID);

route.post('/blogs', verifyUser, upload.single("image"), addBlog);

route.patch('/blogs/:id', verifyUser, upload.single("image"), updateBlog);
route.delete('/blogs/:id',verifyUser,deleteBlog);

route.post('/blogs/like/:id', verifyUser, likeBlog);
route.post('/blogs/comment/:id', verifyUser, addComment);
route.delete('/blogs/comment/:id', verifyUser, deleteComment);
route.patch('/blogs/edit-comment/:id', verifyUser, editComment);
route.post('/blogs/like-comment/:id', verifyUser, likeComment);

module.exports = route