import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to DB...");

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // 🔥 important for Railway
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("DB Error:", error.message);
    throw error; // ❗ don't exit immediately
  }
};

export default connectDB;
