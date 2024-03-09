const mongoose = require("mongoose");

// MongoDB connection URL
const mongoURI = "mongodb://127.0.0.1:27017/magickart";

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Export the connection function
module.exports = connectToDatabase;
