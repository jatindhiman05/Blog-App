const mongoose = require('mongoose');

require('dotenv').config()

async function dbConnect() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DB CONNECTED!");
    } catch (error) {
        console.log("Error While Connecting to DB!", error);
    }
}

module.exports = dbConnect