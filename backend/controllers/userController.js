const User = require("../models/userSchema");
const bcrypt = require('bcryptjs');
const { generateJWT, verifyJWT } = require("../utils/generateToken");

async function createUser(req, res) {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please Fill out all Fields" });
        }


        // Check for existing user
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already Registered with This Email!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name, email, password: hashedPassword
        });

        let token = await generateJWT({
            email: newUser.email,
            id: newUser._id,
        })
        return res.status(200).json({
            success: true,
            message: "User Created Successfully!",
            user: {
                name: newUser.name,
                email: newUser.email,
                blogs: newUser.blogs,
                token,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Occurred while Creating User",
            error: error.message
        });
    }
}

async function login(req, res) {
    const { name, email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please Fill out all Fields" });
        }


        // Check for existing user
        const exists = await User.findOne({ email });
        if (!exists) {
            return res.status(400).json({ success: false, message: "User Not Registered with This Email!" });
        }

        let checkPassValidity = await bcrypt.compare(password, exists.password);

        if (!checkPassValidity) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        let token = await generateJWT({
            email: exists.email,
            id: exists._id,
        })

        return res.status(200).json({ success: true, message: "Logged in Successfully", user: exists,token });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Occurred while Logging in.",
            error: error.message
        });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find({});

        return res.status(200).json({ success: true, message: "Users Fetched Successfully!", users });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Occurred while Fetching the Users"
        });
    }
}
async function getUserById(req, res) {
    try {
        const id = req.params.id;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            });
        }

        return res.status(200).json({ success: true, message: "User Fetched Successfully!", user });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Occurred while Fetching the User"
        });
    }
}

async function updateuser(req, res) {
    try {
        const id = req.params.id;
        const updates = req.body;

        if (!Object.keys(updates).length) {
            return res.status(400).json({ success: false, message: "No Fields Provided for Update" });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            });
        }

        return res.status(200).json({ success: true, message: "User Updated Successfully!", updatedUser });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Occurred while Updating the User",
            error: error.message
        });
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            });
        }

        return res.status(200).json({ success: true, message: "User Deleted Successfully!", deletedUser });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Occurred while Deleting the User",
            error: error.message
        });
    }
}
module.exports = { createUser, getAllUsers, getUserById, updateuser, deleteUser, login };
