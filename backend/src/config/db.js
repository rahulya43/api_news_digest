import mongoose from "mongoose";

// TEMPORARY: hardcoded MongoDB URI to unblock development
// NOTE: This will be moved to environment variables later
const MONGO_URI =
  "mongodb+srv://rahul:984825@cluster0.5pepti0.mongodb.net/ai_news_digest";

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB URI is missing");
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });

    console.log("MongoDB Connected (temporary URI)");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
