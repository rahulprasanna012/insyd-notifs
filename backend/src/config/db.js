const mongoose = require('mongoose');
const dotenv=require("dotenv");
dotenv.config()


const MONGO_URL = process.env.MONGO_URL

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;