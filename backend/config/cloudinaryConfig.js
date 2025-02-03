require('dotenv').config();
const cloudinary = require('cloudinary').v2;

async function cloudinaryConfig() {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log("Cloudinary Configuration Successful!");
    } catch (error) {
        console.log("Error While Configuring Cloudinary!", error);
    }
}

module.exports = cloudinaryConfig;
