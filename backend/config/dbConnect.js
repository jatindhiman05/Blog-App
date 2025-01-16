const mongoose = require('mongoose');

async function dbConnect() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/BlogDatabase");
        console.log("DB CONNECTED!");
    } catch (error) {
        console.log("Error While Connecting to DB!", error);
    }
}

module.exports = dbConnect