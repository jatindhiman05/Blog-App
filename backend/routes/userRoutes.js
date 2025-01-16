const express = require('express');
const { createUser, getAllUsers, getUserById, updateuser, deleteUser, login } = require('../controllers/userController');
const route = express.Router();


route.post('/users', createUser);
route.post('/login', login);
route.get('/users',getAllUsers);

route.get('/users/:id', getUserById);

route.patch('/users/:id', updateuser);

route.delete('/users/:id', deleteUser);

module.exports = route