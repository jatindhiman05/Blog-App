const express = require("express");

const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteAccount,
    login,
    googleAuth,
    verifyEmail,
    followUser, changePassword,
    changeSavedLikedBlog, transferAccount, confirmTransfer
} = require("../controllers/userController");
const verifyUser = require("../middlewares/auth");
const upload = require("../utils/multer");

const route = express.Router();

route.post("/signup", createUser);
route.post("/signin", login);

route.get("/users", getAllUsers);

route.get("/users/:username", getUserById);

route.patch("/users/:id", verifyUser, upload.single("profilePic"), updateUser);

route.delete("/users/:id", verifyUser, deleteAccount);

// verify email/token

route.get("/verify-email/:verificationToken", verifyEmail);

//google auth route
route.post("/google-auth", googleAuth);

// follow /unfollow
route.patch("/follow/:id", verifyUser, followUser);

route.patch("/change-saved-liked-blog-visibility", verifyUser, changeSavedLikedBlog)

// Password change route
route.patch("/change-password", verifyUser, changePassword);

route.post("/transfer-account", verifyUser, transferAccount);
route.get("/confirm-transfer/:action/:token", confirmTransfer);

module.exports = route;
