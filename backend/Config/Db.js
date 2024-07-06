const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(`Connecting to: ${process.env.mongoURI}`);
    const conn = await mongoose.connect(process.env.mongoURI, {
      serverSelectionTimeoutMS: 50000, // 50 seconds
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

module.exports = connectDB;
