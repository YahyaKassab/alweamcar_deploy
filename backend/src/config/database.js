const mongoose = require('mongoose');




const connectDB = async () => {
    const MONGODB_URI =
      process.env.NODE_ENV === 'production'
        ? process.env.MONGODB_URI_PROD
        : process.env.MONGODB_URI_DEV;
    
    try {
        console.log("Connection String: ", MONGODB_URI)
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
