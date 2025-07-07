const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateJWT, verifyJWT } = require("../utils/generateToken");
const transporter = require("../utils/transporter");
const sendNotification = require("../utils/sendNotification");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 5 });
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const {
    deleteImagefromCloudinary,
    uploadImage,
} = require("../utils/uploadImage");
const {
    FIREBASE_TYPE,
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_CLIENT_ID,
    FIREBASE_AUTH_URI,
    FIREBASE_TOKEN_URI,
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    FIREBASE_CLIENT_X509_CERT_URL,
    FIREBASE_UNIVERSAL_DOMAIN,
    EMAIL_USER,
    FRONTEND_URL,
} = require("../config/dotenv.config");
const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");
const { default: mongoose } = require("mongoose");

admin.initializeApp({
    credential: admin.credential.cert({
        type: FIREBASE_TYPE,
        project_id: FIREBASE_PROJECT_ID,
        private_key_id: FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: FIREBASE_CLIENT_EMAIL,
        client_id: FIREBASE_CLIENT_ID,
        auth_uri: FIREBASE_AUTH_URI,
        token_uri: FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: FIREBASE_UNIVERSAL_DOMAIN,
    }),
});

async function createUser(req, res) {
    const { name, password, email } = req.body;

    try {
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Please enter the name",
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please enter the password",
            });
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter the email",
            });
        }

        const checkForexistingUser = await User.findOne({ email });

        if (checkForexistingUser) {
            if (checkForexistingUser.googleAuth) {
                return res.status(400).json({
                    success: true,
                    message:
                        "This email already registered with google. please try through continue with google",
                });
            }
            if (checkForexistingUser.isVerify) {
                return res.status(400).json({
                    success: false,
                    message: "User already registered with this email",
                });
            } else {
                let verificationToken = await generateJWT({
                    email: checkForexistingUser.email,
                    id: checkForexistingUser._id,
                });

                //email logic

                const sendingEmail = transporter.sendMail({
                    from: EMAIL_USER,
                    to: checkForexistingUser.email,
                    subject: "Email Verification",
                    text: "Please verify your email",
                    html: `<h1>Click on the link to verify your email</h1>
              <a href="${FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>`,
                });

                return res.status(200).json({
                    success: true,
                    message: "Please Check Your Email to verify your account",
                });
            }
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const username = email.split("@")[0] + randomUUID();

        const newUser = await User.create({
            name,
            email,
            password: hashedPass,
            username,
        });

        let verificationToken = await generateJWT({
            email: newUser.email,
            id: newUser._id,
        });

        //email logic

        const sendingEmail = transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: "Email Verification",
            text: "Please verify your email",
            html: `<h1>Click on the link to verify your email</h1>
      <a href="${FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>`,
        });

        return res.status(200).json({
            success: true,
            message: "Email Sent! Please verify it to continue...",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: err.message,
        });
    }
}

async function verifyEmail(req, res) {
    try {
        const { verificationToken } = req.params;

        const verifyToken = await verifyJWT(verificationToken);

        if (!verifyToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token/Email expired",
            });
        }
        const { id } = verifyToken;
        const user = await User.findByIdAndUpdate(
            id,
            { isVerify: true },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not exist",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: error.message,
        });
    }
}

async function googleAuth(req, res) {
    try {
        const { accessToken } = req.body;

        const response = await getAuth().verifyIdToken(accessToken);

        const { name, email } = response;

        let user = await User.findOne({ email });

        if (user) {
            // already registered
            if (user.googleAuth) {
                let token = await generateJWT({
                    email: user.email,
                    id: user._id,
                });

                return res.status(200).json({
                    success: true,
                    message: "logged in successfully",
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        profilePic: user.profilePic,
                        username: user.username,
                        showLikedBlogs: user.showLikedBlogs,
                        showSavedBlogs: user.showSavedBlogs,
                        bio: user.bio,
                        followers: user.followers,
                        googleAuth: user.googleAuth,
                        following: user.following,
                        token,
                    },
                });
            } else {
                return res.status(400).json({
                    success: true,
                    message:
                        "This email already registered without google. please try through login form",
                });
            }
        }
        const username = email.split("@")[0] + randomUUID();

        let newUser = await User.create({
            name,
            email,
            googleAuth: true,
            isVerify: true,
            username,
        });

        let token = await generateJWT({
            email: newUser.email,
            id: newUser._id,
        });

        return res.status(200).json({
            success: true,
            message: "Registration in successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic,
                username: newUser.username,
                showLikedBlogs: newUser.showLikedBlogs,
                showSavedBlogs: newUser.showSavedBlogs,
                bio: newUser.bio,
                followers: newUser.followers,
                following: newUser.following,
                googleAuth: newUser.googleAuth,
                token,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: error.message,
        });
    }
}

async function login(req, res) {
    const { password, email } = req.body;

    try {
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please enter the password",
            });
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter the email",
            });
        }

        const checkForexistingUser = await User.findOne({ email }).select(
            "password isVerify name email profilePic username bio showLikedBlogs showSavedBlogs followers following googleAuth"
        );

        if (!checkForexistingUser) {
            return res.status(400).json({
                success: false,
                message: "User not exist",
            });
        }

        if (checkForexistingUser.googleAuth) {
            return res.status(400).json({
                success: true,
                message:
                    "This email already registered with google. please try through continue with google",
            });
        }

        let checkForPass = await bcrypt.compare(
            password,
            checkForexistingUser.password
        );

        if (!checkForPass) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }

        if (!checkForexistingUser.isVerify) {
            // send verification email
            let verificationToken = await generateJWT({
                email: checkForexistingUser.email,
                id: checkForexistingUser._id,
            });

            //email logic

            const sendingEmail = transporter.sendMail({
                from: EMAIL_USER,
                to: checkForexistingUser.email,
                subject: "Email Verification",
                text: "Please verify your email",
                html: `<h1>Click on the link to verify your email</h1>
        <a href="${FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>`,
            });

            return res.status(400).json({
                success: false,
                message: "Please verify you email",
            });
        }

        let token = await generateJWT({
            email: checkForexistingUser.email,
            id: checkForexistingUser._id,
        });

        return res.status(200).json({
            success: true,
            message: "logged in successfully",
            user: {
                id: checkForexistingUser._id,
                name: checkForexistingUser.name,
                email: checkForexistingUser.email,
                profilePic: checkForexistingUser.profilePic,
                username: checkForexistingUser.username,
                bio: checkForexistingUser.bio,
                showLikedBlogs: checkForexistingUser.showLikedBlogs,
                showSavedBlogs: checkForexistingUser.showSavedBlogs,
                followers: checkForexistingUser.followers,
                following: checkForexistingUser.following,
                googleAuth: checkForexistingUser.googleAuth,
                token,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: err.message,
        });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find({});

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: err.message,
        });
    }
}

async function getUserById(req, res) {
    try {
        const username = req.params.username;

        const user = await User.findOne({ username })
            .populate("blogs following likeBlogs saveBlogs")
            .populate({
                path: "followers following",
                select: "name username profilePic",
            })
            .populate({
                path: "blogs likeBlogs saveBlogs",
                populate: {
                    path: "creator",
                    select: "name username profilePic",
                },
            })
            .select("-password -isVerify -__v -email -googleAuth");

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: err.message,
        });
    }
}

async function updateUser(req, res) {
    try {
        const id = req.params.id;
        const { name, username, bio, profilePic } = req.body;
        const image = req.file;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (profilePic === "") {
            // User wants to remove profile picture
            if (user.profilePicId) {
                await deleteImagefromCloudinary(user.profilePicId);
            }
            user.profilePic = null;
            user.profilePicId = null;
        } else if (image) {
            // New image uploaded
            const { secure_url, public_id } = await uploadImage(
                `data:image/jpeg;base64,${image.buffer.toString("base64")}`
            );
            // Remove old image if present
            if (user.profilePicId) {
                await deleteImagefromCloudinary(user.profilePicId);
            }
            user.profilePic = secure_url;
            user.profilePicId = public_id;
        } else if (profilePic) {
            // Keep existing image
            user.profilePic = profilePic;
            // Do not change profilePicId
        }

        if (user.username !== username) {
            const findUser = await User.findOne({ username });
            if (findUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken",
                });
            }
        }

        // Update remaining fields
        user.username = username;
        user.bio = bio;
        user.name = name;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                name: user.name,
                username: user.username,
                bio: user.bio,
                profilePic: user.profilePic,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Please try again",
        });
    }
}


async function deleteAccount(req, res) {
    try {
        const userId = req.user;
        const { currentPassword, googleAuth } = req.body;

        // 1. Get user and verify credentials
        const user = await User.findById(userId).select(googleAuth ? "" : "+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 2. Verify password for non-Google accounts
        if (!googleAuth) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is required"
                });
            }
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect"
                });
            }
        }

        // 3. Delete user's blogs
        await Blog.deleteMany({ creator: userId });

        // 4. Delete all comments by user
        await Comment.deleteMany({ user: userId });

        // 5. Remove user's likes from comments
        await Comment.updateMany(
            { likes: userId },
            { $pull: { likes: userId } }
        );

        // 6. Remove user from followers' lists
        await User.updateMany(
            { followers: userId },
            { $pull: { followers: userId } }
        );

        // 7. Remove user from users they were following
        await User.updateMany(
            { _id: { $in: user.following } },
            { $pull: { followers: userId } }
        );

        // 8. Remove user's likes from blogs
        await Blog.updateMany(
            { likes: userId },
            { $pull: { likes: userId } }
        );

        // 9. Remove user's saves from blogs
        await Blog.updateMany(
            { savedBy: userId },
            { $pull: { savedBy: userId } }
        );

        // 10. Delete profile picture if exists
        if (user.profilePicId) {
            await deleteImagefromCloudinary(user.profilePicId);
        }

        // 11. Finally delete the user account
        await User.findByIdAndDelete(userId);

        // 12. Send confirmation email
        await transporter.sendMail({
            from: EMAIL_USER,
            to: user.email,
            subject: "Account Deletion Confirmation",
            html: `<h1>Account Deleted</h1>
                   <p>Your account has been successfully deleted.</p>
                   <p>We're sorry to see you go.</p>`
        });

        return res.status(200).json({
            success: true,
            message: "Account and all associated data deleted successfully"
        });

    } catch (error) {
        console.error("Account deletion error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete account",
            error: error.message
        });
    }
}
async function followUser(req, res) {
    try {
        const followerId = req.user;
        const { id: userIdToFollow } = req.params;

        if (followerId === userIdToFollow) {
            return res.status(400).json({
                message: "You cannot follow yourself.",
            });
        }

        const userToFollow = await User.findById(userIdToFollow);
        const follower = await User.findById(followerId);

        if (!userToFollow || !follower) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const isAlreadyFollowing = userToFollow.followers.includes(followerId);

        if (!isAlreadyFollowing) {
            await User.findByIdAndUpdate(userIdToFollow, {
                $addToSet: { followers: followerId },
            });

            await User.findByIdAndUpdate(followerId, {
                $addToSet: { following: userIdToFollow },
            });

            // Send follow notification
            await sendNotification({
                req,
                recipientId: userToFollow._id,
                senderId: followerId,
                type: "follow",
                message: "started following you",
            });

            return res.status(200).json({
                success: true,
                message: "Followed successfully",
                following: true,
            });
        } else {
            await User.findByIdAndUpdate(userIdToFollow, {
                $pull: { followers: followerId },
            });

            await User.findByIdAndUpdate(followerId, {
                $pull: { following: userIdToFollow },
            });

            return res.status(200).json({
                success: true,
                message: "Unfollowed successfully",
                following: false,
            });
        }
    } catch (error) {
        console.error("followUser error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
}


async function changeSavedLikedBlog(req, res) {
    try {
        const userId = req.user;
        const { showLikedBlogs, showSavedBlogs } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(500).json({
                message: "User is not found",
            });
        }

        await User.findByIdAndUpdate(userId, { showSavedBlogs, showLikedBlogs });

        return res.status(200).json({
            success: true,
            message: "Visibilty updated",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both current and new password are required",
            });
        }

        const user = await User.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Send password change notification (to self)
        await sendNotification({
            req,
            recipientId: userId,
            senderId: userId,
            type: "custom",
            message: "Your password was changed successfully.",
        });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Password change error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message,
        });
    }
}

async function transferAccount(req, res) {
    try {
        const { currentPassword, newOwnerEmail } = req.body;
        const currentUserId = req.user;
        const isGoogleAuth = req.body.googleAuth || false;

        // Validate input
        if (!newOwnerEmail) {
            return res.status(400).json({
                success: false,
                message: "New owner email is required",
            });
        }

        // Get current user
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Current user not found",
            });
        }

        // For non-Google auth users, verify password
        if (!isGoogleAuth) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is required",
                });
            }

            const userWithPassword = await User.findById(currentUserId).select('+password');
            const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect",
                });
            }
        }

        // Check if transferring to self
        if (currentUser.email === newOwnerEmail) {
            return res.status(400).json({
                success: false,
                message: "Cannot transfer account to yourself",
            });
        }

        // Find new owner user
        const newOwner = await User.findOne({ email: newOwnerEmail });
        if (!newOwner) {
            return res.status(404).json({
                success: false,
                message: "New owner not found with that email",
            });
        }

        // Check if new owner has the same username (would cause conflict)
        if (currentUser.username === newOwner.username) {
            return res.status(400).json({
                success: false,
                message: "Cannot transfer to user with same username - would cause conflicts",
            });
        }

        // Generate transfer token with more metadata
        const transferToken = await generateJWT({
            currentUserId: currentUser._id,
            currentUserEmail: currentUser.email,
            newOwnerId: newOwner._id,
            newOwnerEmail: newOwner.email,
            action: 'account-transfer',
            timestamp: Date.now()
        }, '1d'); // Token expires in 1 day

        // Send confirmation email to new owner
        await transporter.sendMail({
            from: EMAIL_USER,
            to: newOwnerEmail,
            subject: "Account Transfer Request",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Account Transfer Request</h1>
                    <p style="font-size: 16px;">${currentUser.name} (${currentUser.email}) wants to transfer their account to you.</p>
                    <p style="font-size: 16px;">This will give you ownership of:</p>
                    <ul style="font-size: 16px;">
                        <li>All their blogs (${await Blog.countDocuments({ creator: currentUserId })} posts)</li>
                        <li>All their comments</li>
                        <li>Their followers and following relationships</li>
                    </ul>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${FRONTEND_URL}/confirm-transfer/accept/${transferToken}" 
                           style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-right: 15px; font-weight: bold;">
                            Accept Transfer
                        </a>
                        <a href="${FRONTEND_URL}/confirm-transfer/reject/${transferToken}" 
                           style="background-color: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Reject Transfer
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #666;">
                        If you didn't request this, please reject the transfer or ignore this email.
                        This link will expire in 24 hours.
                    </p>
                </div>
            `,
        });

        // Also notify current user that request was sent
        await transporter.sendMail({
            from: EMAIL_USER,
            to: currentUser.email,
            subject: "Transfer Request Sent",
            html: `
                <p>You've requested to transfer your account to ${newOwner.email}.</p>
                <p>They've been notified and must accept the transfer for it to complete.</p>
                <p>You'll receive another email once the transfer is completed or rejected.</p>
            `
        });

        return res.status(200).json({
            success: true,
            message: "Transfer request sent. The recipient must confirm the transfer.",
            data: {
                newOwnerEmail,
                newOwnerName: newOwner.name
            }
        });
    } catch (error) {
        console.error("Account transfer error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to initiate transfer",
            error: error.message,
        });
    }
}

async function confirmTransfer(req, res) {
    try {
        const { action, token } = req.params;

        // Verify the transfer token
        const decoded = await verifyJWT(token);
        if (!decoded || decoded.action !== 'account-transfer') {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired transfer token",
            });
        }

        const { currentUserId, newOwnerId, currentUserEmail, newOwnerEmail } = decoded;

        if (action === 'reject') {
            // Notify the original owner that the transfer was rejected
            const currentUser = await User.findById(currentUserId);
            if (currentUser) {
                await transporter.sendMail({
                    from: EMAIL_USER,
                    to: currentUser.email,
                    subject: "Transfer Rejected",
                    html: `
                        <p>The recipient (${newOwnerEmail}) has rejected your account transfer request.</p>
                        <p>Your account remains unchanged.</p>
                    `
                });
            }

            // Also notify the rejecting user
            await transporter.sendMail({
                from: EMAIL_USER,
                to: newOwnerEmail,
                subject: "Transfer Rejected",
                html: `
                    <p>You've rejected the account transfer request from ${currentUserEmail}.</p>
                    <p>No changes have been made to either account.</p>
                `
            });

            return res.status(200).json({
                success: true,
                message: "Transfer rejected successfully",
            });
        }

        // Proceed with the transfer
        const currentUser = await User.findById(currentUserId);
        const newOwner = await User.findById(newOwnerId);

        if (!currentUser || !newOwner) {
            return res.status(404).json({
                success: false,
                message: "User not found - one of the accounts may have been deleted",
            });
        }

        // Start a transaction to ensure data consistency
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Transfer all blogs
            await Blog.updateMany(
                { creator: currentUserId },
                { $set: { creator: newOwner._id } },
                { session }
            );

            // 2. Transfer all comments
            await Comment.updateMany(
                { user: currentUserId },
                { $set: { user: newOwner._id } },
                { session }
            );

            // 3. Handle followers
            // Remove current user from followers' lists
            await User.updateMany(
                { followers: currentUserId },
                { $pull: { followers: currentUserId } },
                { session }
            );

            // Add new owner to those same users' followers lists
            await User.updateMany(
                { _id: { $in: currentUser.followers } },
                { $addToSet: { followers: newOwner._id } },
                { session }
            );

            // 4. Handle following relationships
            await User.updateMany(
                { _id: { $in: currentUser.following } },
                { $addToSet: { followers: newOwner._id } },
                { session }
            );

            // 5. Transfer saved/liked blogs references
            await User.findByIdAndUpdate(
                newOwner._id,
                {
                    $addToSet: {
                        saveBlogs: { $each: currentUser.saveBlogs },
                        likeBlogs: { $each: currentUser.likeBlogs }
                    }
                },
                { session }
            );

            // 6. Delete the current user account
            await User.findByIdAndDelete(currentUserId, { session });

            // 7. Commit the transaction
            await session.commitTransaction();

            // Send success notifications
            await transporter.sendMail({
                from: EMAIL_USER,
                to: currentUser.email,
                subject: "Account Transfer Completed",
                html: `
                    <p>Your account has been successfully transferred to ${newOwner.name} (${newOwner.email}).</p>
                    <p>All your content is now owned by them.</p>
                    <p>You can no longer access this account.</p>
                `
            });

            await transporter.sendMail({
                from: EMAIL_USER,
                to: newOwner.email,
                subject: "Account Transfer Completed",
                html: `
                    <h2>Transfer Complete</h2>
                    <p>You've accepted the account transfer from ${currentUser.name} (${currentUser.email}).</p>
                    <p>You now own:</p>
                    <ul>
                        <li>${await Blog.countDocuments({ creator: newOwner._id })} blog posts</li>
                        <li>${await Comment.countDocuments({ user: newOwner._id })} comments</li>
                        <li>${currentUser.followers.length} followers</li>
                    </ul>
                    <p>You may want to review the transferred content.</p>
                `
            });

            return res.status(200).json({
                success: true,
                message: "Account transferred successfully",
                data: {
                    transferredBlogs: await Blog.countDocuments({ creator: newOwner._id }),
                    transferredComments: await Comment.countDocuments({ user: newOwner._id }),
                    transferredFollowers: currentUser.followers.length
                }
            });

        } catch (transactionError) {
            await session.abortTransaction();
            console.error("Transfer transaction failed:", transactionError);
            throw transactionError;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error("Transfer confirmation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process transfer",
            error: error.message,
        });
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteAccount,
    login,
    verifyEmail,
    googleAuth,
    followUser,
    changeSavedLikedBlog,
    changePassword, transferAccount, confirmTransfer
};
